"use client";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";

const UserEligibility = ({ item }) => {
  const user = useAppSelector((state) => state.auth.user);
  const [star_user, setStar_user] = useState(
    item.user_stars ? item.user_stars : 0
    // 1
  );

  return (
    <div className="grid grid-cols-12 w-full justify-between items-center gap-3 border rounded-md p-3 shadow-md border-black/5">
      <div className=" w-full col-span-4">
        {item.type == "keyword" ? (
          <p
            className={cn(
              "font-bold",
              user && item.stars <= star_user
                ? "text-green-600"
                : star_user && item.stars && "text-red-500"
            )}
          >
            {item.keyword}
          </p>
        ) : (
          <p className={cn("font-bold")}>{item.education}</p>
        )}
      </div>
      {item.type == "keyword" && (
        <div className=" w-full  col-span-4 flex justify-center items-center">
          {user && item?.stars <= star_user ? (
            <FaCheckCircle color="green"  size={24}/>
          ) : (
            <IoCloseCircleSharp color="red" size={24} />
          )}
        </div>
      )}

      <div className=" flex w-full justify-end items-end  col-span-4">
        <p className="font-bold flex gap-1 items-center text-sm">
          {item.type == "keyword" && (
            <>
              {" "}
              {user && star_user}
              {"/"}
              {item.stars}
              <span>
                {" "}
                <FaStar size={"14"} color="gold" />{" "}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default UserEligibility;
