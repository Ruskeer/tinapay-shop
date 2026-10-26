"use client"; //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
import { useState } from "react"; //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
import Image from "next/image";
import Link from "next/link";
import {signIn} from "next-auth/react";


export default function LoginPage() {
    const [email,setEmail] = useState(''); //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
    const [password,setPassword] = useState(''); //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
    const [loginInProgress, setloginInProgress] = useState(false);
    async function handleFormSubmit(ev) {
        ev.preventDefault();
        setloginInProgress(true);
        
        await signIn('credentials', {email, password, callbackUrl: '/'});
    
        setloginInProgress(false);
    }

    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">Login</h1>
        

            <form className="max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input type="email" placeholder="email" name="email" value={email} 
                onChange={ev => setEmail(ev.target.value)} disabled={loginInProgress}></input>

                <input type="password" placeholder="password" name="password" value={password} 
                onChange={ev => setPassword(ev.target.value)} disabled={loginInProgress}></input>
                <button disabled ={loginInProgress} type="submit">Login</button>



                <div className="text-center text-primary my-4">or Login with provider</div>
                <button 
                type="button"
                onClick={() => signIn('google', {callbackUrl:'/'})} 
                className="flex gap-4 justify-center">
                    
                <Image width="24" alt ="" height="24" src="/googleicon.png"/>
                    Login with Google</button>
            
            
            
            
            </form>    
        </section>
    );
}