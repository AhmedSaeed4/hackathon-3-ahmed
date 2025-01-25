import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppWrapper } from "@/context";
import { client } from "@/sanity/lib/client";
import Navbar from "./components/NavBar";
import { Toaster } from "sonner";

const integralCFFont = localFont({
  src: "../../public/fonts/Fontspring-DEMO-integralcf-bold.otf", 
  variable: "--font-integral-cf", 
  weight: "700", 
  style: "normal", 
});

const satoshiFont = localFont({
  src: "../../public/fonts/Satoshi-Variable.ttf", 
  variable: "--font-satoshi",
  weight: "100 900", 
  style: "normal",
});

const clashFont = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.ttf", 
  variable: "--font-clash",
  weight: "100 900", 
  style: "normal",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function  RootLayout(
  
  {
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const sanityres = await client.fetch(`*[_type == "product"]{
      _id,  
      name,
      "slug": slug.current,
     "imageUrl": image.asset->url,
      price,
      quantity,
      tags,
      description,
      features,
      dimensions,
      category->{   
        name,  
        "slug":slug.current    
      }
    }`)
    if (!sanityres || sanityres.length === 0) {
      return <div>Product not found.</div>;
    }
  return (
    <html lang="en"  className={`${satoshiFont.variable} ${clashFont.variable} ${integralCFFont.variable}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
       <AppWrapper><Navbar product={sanityres}/>{children}<Toaster /></AppWrapper> 
      </body>
    </html>
  );
}
