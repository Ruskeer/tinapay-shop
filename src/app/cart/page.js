"use client";
import { useContext, useEffect, useState } from "react";
import SectionHeaders from "../components/layout/sectionheaders";
import { CartContext, cartProductPrice } from "../components/AppContext";
import Image from "next/image";
import Trash from "../components/icons/Trash";
import AddressInputs from "../components/layout/AddressInputs";
import { useProfile } from "../components/UseProfile";
import toast from "react-hot-toast";
import CartProducts from "../menu/CartProduct";

export default function CartPage() {

    const {cartProducts, removeCartProduct} = useContext(CartContext);
    const [address, setAddress] = useState({});
    const {data:profileData} = useProfile();
    
    useEffect(() => {
        if(typeof window !== 'undefined') {
            if(window.location.href.includes('canceled=1')) {
                toast.error('Payment failed');
            }
        }
    })

    useEffect(() => {
        if (profileData?.city) {
            const {phone, streetAddress, city, postalCode, country} = profileData;
            const addressFromProfile = {
                phone,
                streetAddress,
                city,
                postalCode,
                country
            };
            setAddress(addressFromProfile);
        }
    }
    
    , [profileData]);

    let subtotal = 0;

    for(const p of cartProducts) {
        subtotal += cartProductPrice(p);
    }

    function handleAddressChange(propName, value) {
        setAddress(prevAddress => ({...prevAddress, [propName]:value}));
    }

    async function proceedToCheckout(ev) {
    ev.preventDefault();
    if (subtotal + 5 < 30) {
        toast.error('Minimum order is P30');
        return;
    }

    const promise = fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({address, cartProducts}),
    }).then(async (response) => {
        if (!response.ok) throw new Error('Checkout failed');
        window.location = await response.json();
    });

    await toast.promise(promise, {
        loading: 'Preparing your order...',
        success: 'Redirecting to payment...',
        error: 'Something went wrong...Please try again.',
    });
}

    if (cartProducts?.length === 0) {
        return (
            <section className="mt-8 text-center">
                <SectionHeaders mainHeader="Cart"/>
                <p className="mt-4">Your shopping cart is empty.</p>
            </section>
        );
    }
    
    return (
        <section className="mt-8">
            
            <div className="text-center">
                <SectionHeaders mainHeader="Cart" />
            </div>
            <div className="mt-8 grid gap-8 grid-cols-2">
                <div>
                    {cartProducts?.length === 0 && (
                        <div>No Products in your shopping cart</div>
                    )}

                    {cartProducts?.length > 0 && cartProducts.map((product, index) => (
                        <CartProducts 
                        key={index}
                        index={index}
                        product={product}
                        onRemove={removeCartProduct}
                        />
                    ))}
                    <div className="py-2 flex justify-end pr-16 items-center">
                        <div className="text-primary">
                            Subotal: <br/>
                            Delivery:<br/>
                            Total: 
                        </div>
                        <div className="font-semibold pl-2 text-right">
                            P{subtotal}<br/>
                            P5<br />
                            P{subtotal+5}

                        </div>
                    </div>
                    

                    </div>
                    <div className="bg-bg p-4 rounded-lg">
                        <h2>Checkout</h2>
                        <form onSubmit={proceedToCheckout}>
                            <AddressInputs 
                                addressProps={address}
                                setAddressProp={handleAddressChange}
                                />
                            <button type="submit">Pay P{subtotal+5}</button>
                            {subtotal + 5 < 30 && (
                                <p className="text-sm text-red-500 mb-2">Minimum order is P30</p>
                            )}
                        </form>
                    </div>
                </div>
                </section>
    );
}