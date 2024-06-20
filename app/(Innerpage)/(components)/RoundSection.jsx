"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RoundSection = ({ item, index, color,timerValue }) => {
  const [bgColor, setBgColor] = useState("bg-transparent");

  useEffect(() => {
    const timer = setTimeout(() => {
      setBgColor(color);
    }, timerValue);

    return () => clearTimeout(timer);
  }, [color]);

  const isEligible = item.stars <= item.user_stars;

  return (
    <Link href={"/pages/1"} className="w-full flex flex-col gap-3 justify-center items-center">
      <p className="font-bold">Round {index + 2}</p>
      <div
        className={cn(
          "p-3 min-h-32 justify-center duration-300 transition-all ease-in-out items-center bg-gradient-to-r rounded-full w-full flex flex-col gap-3",
          bgColor
        )}
      >
        <p className="text-center font-bold text-xl text-white underline uppercase">
          {item.title}
        </p>
        <p className="text-center font-bold text-base text-white">
          {item.keyword}
        </p>
        <div className="flex gap-3 items-center">
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
