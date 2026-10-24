"use client";
import { useContext, useState } from "react"; // lets this component read data from a context (the shared cart)
import { CartContext } from "@/app/components/AppContext"; // the shared cart "storage" made in AppContext.js
import toast from "react-hot-toast";
import MenuItemTile from "@/app/menu/MenuItemTile";
import Image from "next/image";
import FlyingButton from 'react-flying-item'

export default function MenuItem(menuItem) { // one menu card; receives its info as props from the menu page

    const {
        image,name,description,basePrice, sizes, extraIngredients
    } = menuItem;

    const [isAdding, setIsAdding] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const {addToCart} = useContext(CartContext); // grab the addToCart function from the shared cart
    const 
    [selectedSize, setSelectedSize] = useState(sizes?.[0] || null);
    const [selectedExtras, setSelectedExtras] = useState([] );



    async function handleAddToCartButtonClick() {
    const hasOptions = sizes?.length > 0 || extraIngredients?.length > 0;

    if (hasOptions && !showPopup) {
        setShowPopup(true);
        return;
    }

    if(hasOptions) {
        if (isAdding) return;
        setIsAdding(true);
        addToCart(menuItem, selectedSize, selectedExtras);
        toast.success('Added to cart');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowPopup(false);
        setIsAdding(false);
        return;
    }
    addToCart(menuItem, selectedSize, selectedExtras);
    toast.success('Added to cart');
    }

    function handleExtraThingClick(ev, extraThing) {
        const checked = ev.target.checked;
        if (checked) {
            setSelectedExtras(prev => [...prev, extraThing]);
        } else {
            setSelectedExtras(prev => {
                return prev.filter(e => e.name !== extraThing.name);
            })
        }
    }

    let selectedPrice = basePrice;
    if(selectedSize) {
        selectedPrice += selectedSize.price;
    }

    if(selectedExtras?.length > 0) {
        for (const extra of selectedExtras) {
            selectedPrice += extra.price;
        }
    }

   return (
    <>
        {showPopup && (
            <div 
            onClick={() => setShowPopup(false)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center">
                <div
                    onClick={ev => ev.stopPropagation()}
                    className="my-8 bg-white p-2 rounded-lg max-h-screen">
                    <div className="overflow-y-scroll p-2"
                    style={{maxHeight:'calc(100vh - 100px)'}}>
                        <Image 
                    className="mx-auto"
                    src={image} alt={name} width={300} height={200} />
                    <h2 className="text-lg font-bold text-center mb-4 mt-4">{name}</h2>
                    <p className="text-center text-gray-500 text-sm mb-2">{description}</p>

                    {sizes?.length > 0 && (
                <div className="p-2">
                    <h3 className="text-center text-primary">Pick your size</h3>
                    {sizes.map(size => (
                        <div key={size._id}>
                            <label className="flex items-center p-4 block py-2 border rounded-md mb-1">
                                <input 
                                onChange={() => setSelectedSize(size)}
                                checked={selectedSize?.name === size.name}
                                type="radio" 
                                name="size" /> {size.name} P{basePrice + size.price}
                            </label>
                        </div>
                    ))}
                </div>
            )}
            {extraIngredients?.length > 0 && (
                <div className="p-2">
                    <h3 className="text-center text-primary">Add extras?</h3>
                    {extraIngredients.map(extraThing => (
                        <div key={extraThing._id}>
                            <label className="flex items-center p-4 block py-2 border rounded-md mb-1">
                                <input
                                    onChange={ev => handleExtraThingClick(ev, extraThing)}
                                    type="checkbox"
                                    checked={selectedExtras.map(e => e._id).includes(extraThing._id)}
                                    name={extraThing.name} /> {extraThing.name} P{extraThing.price}
                            </label>
                        </div>
                    ))}
                </div>
            )}
             <FlyingButton 
                targetTop={'5%'} 
                targetLeft={'95%'} 
                src={image}>
                <div
                    className={"primary sticky bottom-2 " + (isAdding ? "pointer-events-none opacity-60" : "")}
                    onClick={handleAddToCartButtonClick}>
                    Add to cart {selectedPrice}
                </div>
            </FlyingButton>

            <button
            className="mt-2"
                onClick={() => setShowPopup(false)}>
                Cancel</button>
                </div>
                    
            </div>
        </div>
        )}
        <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem} />
    </>
);
}