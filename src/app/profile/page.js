'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react"; //so we can display our name or email to each input
import SuccessBox from "@/app/components/layout/SuccessBox";
import InfoBox from "@/app/components/layout/InfoBox";
import toast from "react-hot-toast";
import Link from "next/link";
import UserTabs from "@/app/components/layout/UserTabs";
import EditableImage from "@/app/components/layout/EditableImage";
import UserForm from "@/app/components/layout/UserForm";

export default function ProfilePage() {
    const session = useSession();
    const {status} = session; //status from session
    const [isAdmin, setIsAdmin] = useState('');
    const [profileFetched, setProfileFetched] = useState('');
    const [user, setUser] = useState(null);

    const [userName, setUserName] = useState('');
    const [image, setImage] = useState(''); 
    const [phone, setPhone] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');



    useEffect(() => { // runs when session or status updates
        if (status === 'authenticated') { // only proceed kung naka-login na talaga (customer showed valid ID)
     
            
            fetch('/api/profile').then(response => { // call the restaurant (your GET route) and place the order
                response.json().then(data => { // unpack the delivery box that came back
                    setUser(data);
                    setIsAdmin(data.admin);
                    setProfileFetched(true);
                })
            });
        }
    }, [session, status]); // array of variables to watch for changes





    async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {'Content-type': 'application/json'},
        }); 

        if (response.ok) 
            resolve();
        else 
            reject();
    });
    
    await toast.promise(savingPromise, {
        loading: 'Saving....',
        success: 'Profile Saved!',
        error: 'Error',
    });
    }

    


    if (status === 'loading' && !profileFetched) {
        return 'Loading....';
    }

    if (status === 'unauthenticated') {
        return redirect('/login');
    }


    const userImage = session.data.user.image; // grabs profile pic url

    return (


        <section className="mt-8">
            <UserTabs isAdmin={isAdmin}/>

            <div className="max-w-2xl mx-auto relative mt-8">        
               {user && <UserForm user={user} onSave={handleProfileInfoUpdate}/>}
            </div>
        </section>


    );
}