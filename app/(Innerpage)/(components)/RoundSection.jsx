"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaStar } from "react-icons/fa6";

const RoundSection = ({ item, index, color, timerValue }) => {
  const [bgColor, setBgColor] = useState("bg-transparent");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBgColor(color);
    }, timerValue);

    return () => clearTimeout(timer);
  }, [color]);

  const isEligible = item.stars <= item.user_stars;

  return (
    <Link
      href={color == "bg-orange-500" ? "/companies/doutya-technologies/1" : "#"}
      className="w-full cursor-pointer flex flex-col gap-3 justify-center items-center"
    >
      <div className=" h-12 p-[0.5px] rounded-md bg-slate-600" />

      <p className="font-bold">Round {index + 2}</p>
      <div
        className={cn(
          "p-3 min-h-32 justify-center duration-300 transition-all ease-in-out items-center bg-gradient-to-r rounded-full w-full flex flex-col gap-3",
          bgColor
        )}
      >
        <p className="text-center  tracking-wider font-bold text-xl text-white underline uppercase">
          {item.title}
        </p>
        <p className="text-center font-bold text-base text-white">
          {item.keyword}
        </p>
        <div className="flex gap-3 items-center">
          <FaStar color="gold" size={12} />
          <p className="text-center font-semibold text-sm text-white">
            {item.stars} {item.keyword} stars are required.
          </p>
          <div className="text-sm px-3 py-0 border border-green-400 font-bold bg-white">
            {item.user_stars ? item.user_stars : 0}/{item.stars}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoundSection;
