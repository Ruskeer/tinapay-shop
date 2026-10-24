"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useProfile } from "@/app/components/UseProfile";
import UserTabs from "@/app/components/layout/UserTabs";
import EditableImage from "@/app/components/layout/EditableImage";
import { redirect } from "next/navigation";
import MenuItemForm from "@/app/components/layout/MenuItemForm";

export default function NewMenuItemPage() {
 
    const {loading, data} = useProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);
          
        async function handleFormSubmit(ev, data) {
            ev.preventDefault();
            const savingPromise = new Promise (async(resolve,reject) => {
                const response = await fetch("/api/menu-items", {
                method: 'POST',
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
           
            <MenuItemForm menuItem={null} onSubmit={handleFormSubmit}/>
        </section>
    );
}