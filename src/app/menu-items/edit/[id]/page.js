
"use client";
import toast from "react-hot-toast";
import Link from "next/link";
import { useProfile } from "@/app/components/UseProfile";
import UserTabs from "@/app/components/layout/UserTabs";
import EditableImage from "@/app/components/layout/EditableImage";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MenuItemForm from "@/app/components/layout/MenuItemForm";
import DeleteButton from "@/app/components/DeleteButton";

export default function EditMenuItemPage() {
const [menuItems, setMenuItems] = useState(null);
const {id} = useParams();
const {loading, data} = useProfile();
const [redirectToItems, setRedirectToItems] = useState(false);



    useEffect(() => {
        
        fetch('/api/menu-items').then(res =>{
            res.json().then(items => {
                const item = items.find(i => i._id === id);
                setMenuItems(item);
            });
        })

    }, []);
        
    
    
        async function handleFormSubmit(ev, data) {
            ev.preventDefault();
            data = {...data, _id:id}
            const savingPromise = new Promise (async(resolve,reject) => {
                const response = await fetch("/api/menu-items", {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: { 'Content-type' : 'application/json'},
            });
            if(response.ok)
                resolve();
            else
                reject();
            });
    
            await toast.promise(savingPromise, {
                loading: 'Saving this delicious tinapay',
                success: 'Saved',
                error: 'Error',
            });
    
        setRedirectToItems(true);
    
    }

    async function handleDeleteClick() {
        const promise = new Promise(async(resolve, reject) => {
            const res = await fetch('/api/menu-items?_id=' + id, {
                method: 'DELETE',
            });
            if (res.ok)
                resolve();
            else 
                reject();
        
    });

    await toast.promise(promise, {
        loading: 'Deleting...',
        success: 'Deleted',
        error: 'Error, sorry...'
    });
    setRedirectToItems(true);
}
    
    if (redirectToItems) {
        return redirect('/menu-items');
    }



    if (loading) {
        return 'Loading user info...';
    }

    if (!data.admin) {
        return 'Not an admin';
    }
    return (
        <section className="mt-8">
            <UserTabs isAdmin={true}/>
            
            <MenuItemForm menuItem={menuItems} onSubmit={handleFormSubmit}/>

            <div className ="max-w-md mx-auto mt-2">
                <div className="md:grid gap-4" style={{gridTemplateColumns: '.3fr .7fr'}}>
                    <div></div>
                    <div>
                        <DeleteButton 
                        label="Delete this menu item"
                        onDelete={handleDeleteClick}
                        />
                    </div>
                </div>              
            </div>
        </section>
    );
}