"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseImgURL, baseURL, generateSlug } from "@/lib/baseData";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { CirclePlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MyCompany = () => {
  const [userPages, setUserPages] = useState([]);
  const user = useAppSelector((state) => state.auth.user);

  const fetchUserPages = async () => {
    try {
      // Only fetch rewards if user data is available
      const response = await axios.get(
        `${baseURL}/get-all-user-pages.php?user_id=${user ? user.id : null}`
      );
      // console.log(response.data)
      if (response.data.success) {
        setUserPages(response.data.data);
      }
    } catch (error) {
      console.error("Error while fetching pages:", error.message);
    }
  };
  useEffect(() => {
    fetchUserPages();
  }, [user]);
  return (
    <>
      {userPages && (
        <div>
          <div className="w-full  overflow-x-scroll flex items-center gap-3 max-w-[1200px] mx-auto ">
            <div className=" h-full items-center ">
              <p className="font-bold text-sm px-3 text-gray-600 md:text-base whitespace-nowrap">
                My Companies
              </p>
            </div>
            <div className="  items-center w-full  flex gap-3  mt-1  p-1">
              {userPages?.length > 0 &&
                userPages.map((item) => {
                  const slug = generateSlug(item.title);

                  return (
                    <Link
                      className="flex flex-col justify-center items-center"
                      href={`/companies/${slug}`}
                      key={item.id}
                    >
                      <div className="w-[46px] h-[46px] rounded-2xl border relative bg-white shadow-sm">
                        <Image fill src={baseImgURL + item.icon} />
                      </div>
                      <p className=" font-bold text-slate-500 text-center text-[9px] mt-2">
                        {item.title}
                      </p>
                    </Link>
                  );
                })}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-[46px] h-[46px] rounded-2xl border relative bg-white shadow-sm">
                      <Image
                        fill
                        src={`/assets/images/bckgr3.png`}
                        className="rounded-2xl"
                      />

                      <p className="absolute top-0 justify-center flex items-center left-0 w-[46px] h-[46px]">
                        <CirclePlus />
                      </p>
                    </div>
                    <p className=" font-bold text-slate-500 text-center text-[9px] mt-2">
                      Add New
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-72 max-w-96  p-3">
                    <p class="text-sm text-gray-600 font-bold text-center">
                      Coming soon!
                    </p>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyCompany;
