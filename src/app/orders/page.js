"use client";
import SectionHeaders from "@/app/components/layout/sectionheaders";
import { useState, useEffect } from "react";
import UserTabs from "../components/layout/UserTabs";
import { useProfile } from "../components/UseProfile";
import dbTimeForHuman from "@/app/lib/datetime";
import Link from "next/link";


export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const {loading, data:profile} = useProfile();
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    function fetchOrders() {
    setLoadingOrders(true);
    fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
            setOrders(Array.isArray(data) ? data.reverse() : []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
}

    return (
        <section className="mt-8 max-w-2xl mx-auto">
        <UserTabs isAdmin={profile?.admin}/>
            <div className="mt-8">
                {loadingOrders && (
                    <div>Loading orders...</div>
                )}
                {orders?.length > 0 && orders.map(order => (
                <div key={order._id} className="bg-bg mb-2 p-4 rounded-lg flex flex-col md:flex-row text-center gap-6">
                    <div className="grow flex flex-col md:flex-row items-center gap-3">
                        <div className="">
                            <div className={
                                (order.paid? 'bg-green-500' : 'bg-red-500')
                                + ' p-2 rounded-md w-24 text-white'
                            }>
                                {order.paid ? 'Paid' : 'Not Paid'}
                            </div>
                        </div>
                        <div className="grow">
                            <div className="flex gap-2 items-center mb-1">
                                <div className="grow">{order.userEmail}</div>
                                <div className="text-colorprimary text-sm">
                                    {dbTimeForHuman(order.createdAt)}
                                </div>
                            </div>

                            

                            <div className="text-colorprimary text-sm">
                                {order.cartProducts?.map(p => p.name).join(', ')}
                            </div>
                            
                        </div>
                    </div>
                    
                    <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                        
                        
                        <Link href={"/orders/"+order._id} className="button">
                            Show Order
                        </Link>
                    </div>
                    
                </div>
                ))}
            </div>

            
        </section>
    );
}