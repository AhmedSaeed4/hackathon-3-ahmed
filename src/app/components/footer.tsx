import Link from "next/link";
import Image from "next/image";
import face from "../assets/logos/face.png"
import insta from "../assets/logos/Vector.png"
import twitter from "../assets/logos/twitter.png"
import pin from "../assets/logos/pin.png"
import skype from "../assets/logos/skype.png"
import linkedin from "../assets/logos/linkedin.png"

const Footer = () => {
  
  return (
    <div className=" px-6 sm:px-[82px] py-8 bg-[#2A254B] sm:pt-[58px]">
      <div className="flex flex-wrap gap-12 sm:gap-[133px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-28 ">
        <div className="text-white w-full sm:w-auto flex flex-col gap-[12px]">
          <h1 className="text-lg font-clash font-normal leading-[18.9px]">Menu</h1>
          <div className="flex flex-col gap-[12px] text-[14px] leading-[19.68px]">
            <h1><Link href="/">New Arrivals</Link></h1>
            <h1><Link href="/">Best sellers</Link></h1>
            <h1><Link href="/">Recently viewed</Link></h1>
            <h1><Link href="/">Popular this week</Link></h1>
            <h1><Link href="/">All Products</Link></h1>
          </div>
        </div>

        <div className="text-white w-full sm:w-auto flex flex-col gap-[12px]">
          <h1 className="text-lg font-clash font-normal leading-[18.9px]">Categories</h1>
          <div className="flex flex-col gap-[12px] text-[14px] leading-[19.68px]">
            <h1>
              <Link href="/">Crockery</Link>
            </h1>
            <h1>
              <Link href="/">Furniture</Link>
            </h1>
            <h1>
              <Link href="/">Homeware</Link>
            </h1>
            <h1>
              <Link href="/">Plant pots</Link>
            </h1>
            <h1>
              <Link href="/">Chairs</Link>
            </h1>
          </div>
        </div>

        <div className="text-white w-full sm:w-auto flex flex-col gap-[12px]">
          <h1 className="text-lg font-clash font-normal leading-[18.9px]">Our Company</h1>
          <div className="flex flex-col gap-[12px] text-[14px] leading-[19.68px]">
            <h1>
              <Link href="/about">About us</Link>
            </h1>
            <h1>
              <Link href="/">Vacancies</Link>
            </h1>
            <h1>
              <Link href="/">Contact us</Link>
            </h1>
            <h1>
              <Link href="/">Privacy</Link>
            </h1>
            <h1>
              <Link href="/">Return policy</Link>
            </h1>
          </div>
        </div>
      </div>

        <div className="text-white w-full sm:w-auto flex flex-col gap-[12px]">
          <h1 className="text-lg font-clash font-normal leading-[18.9px]">Join our mailing list</h1>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="your@email.com"
              className=" p-0  sm:p-2 sm:pr-20  pl-8 bg-[#FFFFFF26]"
            />
            <button type="submit" className="w-auto  h-[48px] px-[32px]  bg-white text-[#2A254B]">Sign up</button>
          </form>
        </div>
      </div>

      <hr className="bg-[#4E4D93] my-8" />

      <div className="flex flex-wrap justify-between items-center text-white gap-4">
        <div>
          <h1>Copyright 2022 Avion LTD</h1>
        </div>
        <div className="flex gap-[24px]">
          <a href="https://www.linkedin.com/in/ahmed-saeed-0278a12b5/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={linkedin} alt="" className="w-[18px] h-[17.92px] "/> </a>
          <Link href="/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={face} alt="" className="w-[18px] h-[18px] "/> </Link>
          <a href="https://www.instagram.com/mizuu.edit/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={insta} alt="" className="w-[18px] h-[18px] "/> </a>
          <Link href="/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={skype} alt="" className="w-[19.37px] h-[19.42px] "/> </Link>
          <Link href="/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={twitter} alt="" className="w-[16.5px] h-[13.41px] "/> </Link>
          <Link href="/" className="w-[24px] h-[24px] flex justify-center items-center "><Image src={pin} alt="" className="w-[20.93px] h-[21px] "/> </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
