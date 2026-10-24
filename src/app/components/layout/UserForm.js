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
import { useProfile } from "../UseProfile";
import AddressInputs from "./AddressInputs";

export default function UserForm({user, onSave}) {
    const [userName, setUserName] = useState(user?.name || '');
    const [image, setImage] = useState(user?.image || ''); 
    const [phone, setPhone] = useState(user?.phone || '');
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
    const [postalCode, setPostalCode] = useState(user?.postalCode || '');
    const [city, setCity] = useState(user?.city || '');
    const [country, setCountry] = useState(user?.country || '');
    const [admin, setAdmin] = useState(user?.admin || false);
    const {data:loggedInUserData} = useProfile();


    function handleAddressChange(propName, value) {
        if(propName === 'phone' ) setPhone(value);
        if(propName === 'streetAddress' ) setStreetAddress(value);
        if(propName === 'postalCode' ) setPostalCode(value);
        if(propName === 'city' ) setCity(value);
        if(propName === 'country' ) setCountry(value);
    }

    return (
    <div className="md:flex gap-2 ">
        <div>
            <div className="flex flex-col justify-center items-center">
                <EditableImage link={image} setLink={setImage}/>
            </div>
        </div>
            <form 
            className="grow" 
            onSubmit={ev => 
                onSave(ev, {name: userName, image, phone, streetAddress, city, country, postalCode, admin})
            }
            >

                <label>
                    First and Last Name
                </label>

                <input type="text" placeholder="First and Last name" 
                value={userName} onChange={ev => setUserName(ev.target.value)}
                />

                <label>Email</label>
                <input type="email" disabled={true}
                value={user?.email} 
                placeholder={'email'}
                />

                <AddressInputs
                    addressProps={{phone,streetAddress,postalCode,city,country}}
                    setAddressProp={handleAddressChange} 
                    />
                

                {loggedInUserData && (
                    <div>
                    <label className="p-2 flex inline-flex items-center mb-2 gap-2 block" htmlFor="adminCb">
                        <input 
                        className=""
                        value={'1'}
                        id="adminCb" 
                        type="checkbox" 
                        checked={admin}
                        onChange={ev => setAdmin(ev.target.checked)}/>
                        <span>Admin</span>
                    </label>
              
                    </div>
                )}


                
                <button type="submit">Save</button>
        </form>
    </div>
    );
}