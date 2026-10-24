"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useContext, useState } from "react";
import { CartContext } from "../AppContext";
import ShoppingCart from "../icons/ShoppingCart";
import Bars2 from "../icons/Bars2";

function AuthLinks({status, userName, userImage}) {
  if (status === 'authenticated') {
    return (
      <>
        <Link className="whitespace-nowrap flex items-center gap-2 mr-4" href="/profile">
          Hello,
          {userImage && (
            <Image src={userImage} alt="" width={24} height={24} className="rounded-full" />
          )}
          {userName}
        
        </Link>
        <button 
        onClick={() => signOut()} // logs the user out when clicked
        className="rounded-b-full bg-primary text-white px-1 py-5">Logout</button> 
      </>
    );
  }

  if(status === 'unauthenticated') {
    return(
      <>
        <Link href={'/login'}>Login</Link>
        <Link href={'/register'} className="rounded-b-full bg-primary text-white px-4 py-5">Register</Link> {/*login design*/}
      </>
    );
  }

  }




export default function Header() { 
    const session = useSession(); // pulls current login state from SessionProvider
    const status = session?.status; // just the status part: 'authenticated', 'unauthenticated', or 'loading'
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
     
    const userData = session?.data?.user;
    let userName = userData?.name || userData?.email; //get my name and email from the console object data to display it on the screen when logged in 
    const {cartProducts} = useContext(CartContext);
    if (userName && userName.includes(' ')) {
      userName = userName.split(' ')[0];
    }

    const userImage = userData?.image;



    
    return (
      
        <header className=""> 
        <div className="flex justify-between md:hidden">
          <Link className="flex gap-2 items-center" href={'/'}>
              <Image src="/logo.png" alt="unimed logo" width={50} 
              height={50}/> <span className="text-primary 
              font-semibold text-2xl" href="/">
              Tinapay</span>
            </Link> {/*Title of my web*/}

            <div className="flex gap-8 items-center">
              
              <Link href={'/cart'} className="relative">
                <ShoppingCart />

                {cartProducts?.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-2 rounded-full leading-3">
                  {cartProducts.length}</span>
                )}
              
              </Link>
              <button 
              onClick={() => setMobileNavOpen(open=> !open)}
              className="p-1 border">
                <Bars2 />
              </button>
            </div>
        </div>

        {mobileNavOpen && (
          <div 
          onClick={() => setMobileNavOpen(false)}
          className="md:hidden p-4 bg-bg rounded-lg mt-2 flex flex-col text-center">
          <Link href={'/'}>Home</Link>{/*I'd rather use link than <a> why because i prefer client-side navigation (swaps just the content that changed, no full reload, feels instant/faster)*/}
          <Link href={'/menu'}>Menu</Link>
          <Link href={'/#about'}>About</Link>
          <Link href={'/#contact'}>Contact</Link>
          <AuthLinks status={status} userName={userName} userImage={userImage} />
        </div>
        )}

        

        <div className="hidden md:flex items-center justify-between">
          <nav className="items-center flex gap-8 text-colorprimary font-semibold"> {/*flex to separate them*/}

            <Link className="flex gap-2 items-center" href={'/'}>
              <Image src="/logo.png" alt="unimed logo" width={50} 
              height={50}/> <span className="text-primary 
              font-semibold text-2xl" href="/">
                Tinapay</span></Link> {/*Title of my web*/}

            <Link href={'/'}>Home</Link>{/*I'd rather use link than <a> why because i prefer client-side navigation (swaps just the content that changed, no full reload, feels instant/faster)*/}
            <Link href={'/menu'}>Menu</Link>
            <Link href={'/#about'}>About</Link>
            <Link href={'/#contact'}>Contact</Link>
            
          </nav>

          <nav className="flex items-center gap-4 text-primary font-semibold">
            <AuthLinks status={status} userName={userName} userImage={userImage} />
            
            <Link href={'/cart'} className="relative">
              <ShoppingCart />
              {cartProducts?.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-2 rounded-full leading-3">
                  {cartProducts.length}
                </span>
              )}
            </Link>
            
          </nav>
        </div>
        
      </header>
    );
}