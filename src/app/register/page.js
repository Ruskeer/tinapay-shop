"use client"; //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
import { useState } from "react"; //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const [email,setEmail] = useState(''); //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
    const [password,setPassword] = useState(''); //NECESSARY FOR OBTAINING EMAIL AND PASS INFO
    const [userCreated, setuserCreated] = useState(false);
    const [creatinguser, setcreatinguser] = useState(false);
    const [error,setError] = useState(false);

    async function handleFormSubmit(ev) {
        ev.preventDefault();

        setcreatinguser(true); // flips on the moment i hit submit, this is what disables the inputs/button while we wait
        setError(false); // clear any old error message from a previous failed attempt
        setuserCreated(false); // clear the old success message too, in case they're submitting again
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-type': 'application/json'},
        });
        // pauses here until the server responds, could take a second or two
        if(response.ok) {
            setuserCreated(true); // server said it worked, show the success message
            setEmail('');
            setPassword('');

        }
        else {
            setError(true); // server said no, show the error message instead
        }
        setcreatinguser(false); // flips back off once we get ANY response back, success or fail — inputs become usable again

    }
    return (
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">Register</h1>

            {userCreated && ( // only show this block if userCreated is true, otherwise nothing renders here
                <div className="text-center my-4">
                    User created. Now you can <a className="underline" href="/login">Login</a>
                </div>
            )}

            {error && ( // same thing but for the error message, only shows up if error is true
                <div className="text-center my-4">
                    An error has occured.<br />
                    Please try again later.
                </div>
            )}

            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>

                <input type="email" placeholder="email" value={email} 
                onChange={ev => setEmail(ev.target.value)} disabled={creatinguser}></input>

                <input type="password" placeholder="password" value={password} 
                onChange={ev => setPassword(ev.target.value)} disabled={creatinguser}></input>

                <button type="submit" disabled={creatinguser}>Register</button>

                <div className="text-center text-primary my-4">or Login with provider</div>
                <button
                type ="button" 
                onClick={() => signIn('google', {callbackUrl:'/'})}
                disabled={creatinguser} className="flex gap-4 justify-center">
                    <Image width="24"  height="24" src="/googleicon.png"/>
                    Login with Google</button>

                <div className="border-t text-center my-4 text-primary pt-4">
                    Existing Account? {' '}
                    <Link href={'/login'} className="underline">Login here &raquo;</Link>
                </div>
            </form>
        </section>
    );
}