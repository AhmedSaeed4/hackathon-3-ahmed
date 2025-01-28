"use client"
import Image from "next/image";
import check from "../assets/Vector.png";
import { useState } from "react";

const Email = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
    } else {
      setError("");
      alert("Successfully signed up with: " + email);
    }
  };

  return (
    <div className="">
      <div className="bg-[url('/img.jpg')] sm:h-[444px] flex flex-col h-[370px] bg-cover sm:bg-center bg-left-bottom sm:pt-[97px] pt-[24px] pl-[24px] pr-[37px] sm:px-[0px]">
        <div id="top content" className="w-auto h-auto flex flex-col sm:gap-[30px] gap-[20px]">
          <div id="top text" className="w-auto h-auto flex flex-col gap-[12px]">
            <h2 className="font-clash font-normal text-[24px] sm:text-[32px] leading-[33.6px] sm:leading-[44.8px] sm:text-center text-white">
              Join the club and get the benefits
            </h2>
            <p className="font-satoshi font-normal sm:text-[18px] sm:leading-[27px] text-[14px] leading-[21px] sm:text-center text-white">
              Sign up for our newsletter and receive exclusive offers on new ranges, sales, pop up stores and more
            </p>
          </div>
          <div id="benefits" className="w-auto h-auto flex flex-col sm:flex-row sm:justify-center sm:items-center gap-[8px] sm:gap-[36px]">
            <div id="frame 61" className="w-auto h-auto flex items-center gap-[8px]">
              <Image src={check} alt="" className="w-[16px] h-[16px]" />
              <p className="font-satoshi font-normal text-[16px] leading-[24px] text-center text-white">
                Exclusive offers
              </p>
            </div>

            <div id="frame 61" className="w-auto h-auto flex items-center gap-[8px]">
              <Image src={check} alt="" className="w-[16px] h-[16px]" />
              <p className="font-satoshi font-normal text-[16px] leading-[24px] text-center text-white">
                Free events
              </p>
            </div>

            <div id="frame 61" className="w-auto h-auto flex items-center gap-[8px]">
              <Image src={check} alt="" className="w-[16px] h-[16px]" />
              <p className="font-satoshi font-normal text-[16px] leading-[24px] text-center text-white">
                Large discounts
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-auto h-auto self-center mt-[40px] flex">
          <input
            type="email"
            placeholder="      your@email.com"
            className="sm:pr-[10.42vw]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-auto h-auto py-[16px] px-[32px] flex gap-[10px] bg-[#2A254B]">
            <p className="font-satoshi font-normal text-[16px] leading-[24px] text-center text-nowrap text-white">
              Sign up
            </p>
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Email;
