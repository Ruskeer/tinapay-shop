"use client";
import { useState } from 'react';
import FlyingButton from 'react-flying-item'

export default function AddToCartButton({hasSizesOrExtras, onClick, basePrice, image}) {
    const [busy, setBusy] = useState(false);

    function handleClick() {
        if (busy) return;       // ignore clicks while the animation is running
        setBusy(true);          // lock the button
        onClick();              // add to cart
        setTimeout(() => setBusy(false), 800); // unlock after 0.8 seconds
    }

    if (!hasSizesOrExtras) {
    return (
        <div
            onClickCapture={handleClick}
            className={'mt-4 flying-button-parent ' + (busy ? 'pointer-events-none opacity-60' : '')}>
            <FlyingButton
                targetTop={'5%'}
                targetLeft={'95%'}
                src={image}>
                <div>
                    Add to cart P{basePrice}
                </div>
            </FlyingButton>
        </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick} // when clicked, run addToCart (adds this item to the cart)
            className="mt-4 text-white px-4 py-2 rounded-full bg-primary">
            <span>Add to cart (from P{basePrice})</span>
        </button>
    );
}