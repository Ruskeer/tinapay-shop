import Link from "next/link";
import Image from "next/image";
import Right from "../icons/right";
export default function Hero() {
    return (
        <section className="hero md:mt-4">

            <div className="md:py-12 py-8">
                <h1 className="font-semibold text-4xl">Baked fresh. <br/>Loved instantly.</h1>
                <p className="text-sm my-6 text-colorprimary">
                    There&apos;s nothing like the smell of fresh bread to make a house feel like home.
                </p>

            <div className="text-sm flex gap-4 items-center text-colorprimary">
                <button className="justify-center uppercase flex items-center gap-2 bg-primary text-white px-8 py-2 rounded-full">Order Now<Right />
                </button>

                <button className="items-center border-0 flex gap-2 font-semibold text-center bg-headerbg">
                    Learn More
                    <Right />
                    </button>

            </div>
            </div>

            <div className="relative hidden md:block">
                <Image src="/pandesalheader.png" layout="fill" objectFit="contain"></Image>
            </div>

        </section>
    );
}