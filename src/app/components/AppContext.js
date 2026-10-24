'use client'; // SessionProvider needs client-side, this file exists just for that
import { SessionProvider } from "next-auth/react"; // gives every page access to login/session data
import { createContext, useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

export function cartProductPrice(cartProduct) {
    let price = cartProduct.basePrice;
    if (cartProduct.size) {
        price += cartProduct.size.price;
    }
    if (cartProduct.extras?.length > 0) {
        for (const extra of cartProduct.extras) {
            price += extra.price;
        }
    }
    return price;
}

export function AppProvider({children}) {
    const [cartProducts, setCartProducts] = useState([]);
    const ls = typeof window !== 'undefined' ? window.localStorage : null;

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts( JSON.parse (ls.getItem('cart')));
        }
    }, []);


    function clearCart() {
        setCartProducts([]);
        saveCartProductsLocalStorage([]);
    }

    function removeCartProduct(indexToRemove) {
        setCartProducts(prevCartProducts => {
            const newCartProducts = prevCartProducts
            .filter((v, index) => index !== indexToRemove)

            saveCartProductsLocalStorage(newCartProducts);
            
            return newCartProducts;
        });
        toast.success('Product removed');
    }

    function saveCartProductsLocalStorage(cartProducts) {
        if(ls) {
            ls.setItem('cart', JSON.stringify(cartProducts));
        }
    }

    function addToCart(product, size=null, extras=[]) {
    setCartProducts(prevProducts => {
        const cartProduct = {...product, size, extras};
        const newProducts = [...prevProducts, cartProduct]; // build the new cart list
        saveCartProductsLocalStorage(newProducts);          // save that list in the browser
        return newProducts;                                  // give it to React
    });
    }

    return (
        <SessionProvider>
            <CartContext.Provider value={{
                cartProducts, setCartProducts, addToCart, removeCartProduct, clearCart,
            }}>
                {children}
            </CartContext.Provider>
        </SessionProvider> // wraps the whole app so useSession() works anywhere
    );
}