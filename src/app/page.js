import Image from "next/image";
import Header from "./components/layout/header";
import Hero from "./components/layout/hero";
import HomeMenu from "./components/layout/HomeMenu";
import MenuItem from "./components/layout/menu";
import SectionHeaders from "./components/layout/sectionheaders";


export default function Home() {
  return (
    <>
    <div className="bg-bg m-0 p-0 bg-cover bg-center w-full min-h-screen">
      <div className="bg-headerbg px-12 mb-4">
        
        <Hero />
      </div>
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Our Story'}
          mainHeader={'About us'}
        />
        <div className="text-primary max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>Tinapay started with one simple belief  nothing fixes a bad day like warm oten. </p>
          <p className="max-w-2xl mx-auto mt-4">Our pandesal is the main dish and are baked fresh every morning, and our kitchen smells so good that the neighbors started screaming Oh hail Russel The Delicious Big boy.</p>
        </div>      
      </section>

      <section className="text-center my-8" id="contact">
        <SectionHeaders 
          subHeader={'Don\'t hesitate'}
          mainHeader={'Contact us'}/>

          <div className="mt-8">
            <a className="text-4xl underline text-primary" href="tel:+46 583 984 2202">+63 967 207 8489</a>
          </div>
      </section>
       
    </div>
    </>
  );
}
