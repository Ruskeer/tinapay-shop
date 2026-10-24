"use client";
import Link from "next/link";
import { useProfile } from "../components/UseProfile";
import UserTabs from "@/app/components/layout/UserTabs";
import Right from "@/app/components/icons/right";
import { useEffect, useState } from "react";



export default function MenuItemsPage() {
    const {loading, data} = useProfile();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('/api/menu-items').then(res =>{
            res.json().then(menuItems => {
                setMenuItems(menuItems);
            });
        })
    }, [])

    if (loading) {
        return 'Loading user info...';
    }

    if(!data?.admin) {
        return 'Not an admin...';
    }



    return (
        <section className="mt-8">
            <UserTabs isAdmin={true}/>
            <div className="mt-8">
                <Link 
                className="button"
                href={'/menu-items/new'}>
                <span>Create new menu item</span>
                <Right />
                </Link>   
            </div>
            <div>
                <h2 className="text-sm text-primary mt-8">Edit Menu Item: </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menuItems?.length > 0 && menuItems.map(item => (
                    <Link
                        key={item._id}
                        href={'/menu-items/edit/' + item._id}
                        className="bg-primary text-white rounded-lg p-4 text-center"
                    >
                        <div className="aspect-square">
                            <img
                                className="rounded-md w-full h-full object-cover"
                                src={item.image}
                                alt={item.name}
                            />
                        </div>
                        <div className="mt-3 font-semibold">
                            {item.name}
                        </div>
                    </Link>
                ))}
            </div>
                
            </div>
       
        </section>
    );
}