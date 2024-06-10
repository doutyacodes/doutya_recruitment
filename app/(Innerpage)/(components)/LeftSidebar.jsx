"use client";
import React, { useEffect, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { baseImgURL, baseURL } from "@/lib/baseData";
import Image from "next/image";
import Link from "next/link";
import { FaPeopleArrows } from "react-icons/fa";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaPeopleGroup, FaPeoplePulling } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";

const LeftSidebar = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [userPages, setUserPages] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getAllUserPages.php?user_id=${user.id}`
          );
          if (response.status === 200) {
            setUserPages(response.data);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch pages");
          }
        } catch (error) {
          console.error("Error while fetching pages:", error.message);
        }
      }
    };

    fetchPages();
    const fetchFollowers = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getUserFollowers.php?user_id=${user.id}`
          );
          if (response.status === 200) {
            setFollowers(response.data);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch followers");
          }
        } catch (error) {
          console.error("Error while fetching followers:", error.message);
        }
      }
    };

    fetchFollowers();
    const fetchFollowing = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getUserFollowing.php?user_id=${user.id}`
          );
          if (response.status === 200) {
            setFollowing(response.data);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch following");
          }
        } catch (error) {
          console.error("Error while fetching following:", error.message);
        }
      }
    };

    fetchFollowing();
    const fetchFriends = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getUserFriends.php?user_id=${user.id}`
          );
          if (response.status === 200) {
            setFriends(response.data);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch friends");
          }
        } catch (error) {
          console.error("Error while fetching friends:", error.message);
        }
      }
    };

    fetchFriends();
  }, [user]);
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/getSearchUser.php?q=${searchQuery}&user_id=${
            user ? user.id : null
          }`
        );
        if (response.status === 200) {
          setSearchData(response.data);
          // console.log(response.data);
        } else {
          console.error("Failed to fetch search");
        }
      } catch (error) {
        console.error("Error while fetching friends:", error.message);
      }
    };

    fetchSearch();
  }, [user, searchQuery]);
  return (
    <div className=" w-full h-full  overflow-scroll">
      <div className="flex mt-5 gap-3 bg-white border border-black/5 items-center rounded-md relative">
        <Search className="ml-3" />
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search..."
          className="focus:outline-none bg-transparent px-2 py-3 flex-1"
        />
        {searchQuery.length >= 1 && searchData.length > 0 && (
          <div className="absolute bg-white shadow-md  rounded-md top-10 w-full p-4 z-30">
            {searchData?.length > 0 &&
              searchData?.map((item, index) => {
                let Navpass;
                item.type == "user"
                  ? (Navpass = `/user/${item.id}`)
                  : (Navpass = `/pages/${item.id}`);
                // console.log(item)
                return item.type == "user" ? (
                  <Link
                    href={Navpass}
                    className="flex gap-2 mt-4 items-center "
                    key={index}
                  >
                    <div
                      className={cn(
                        " relative  h-12 w-12 ",
                        item?.user_image
                          ? ""
                          : " bg-[#ff8f8e] rounded-full flex justify-center items-center"
                      )}
                    >
                      {item?.user_image ? (
                        <Image
                          src={baseImgURL + item?.user_image}
                          fill
                          alt="Profile Image"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <p className="text-2xl text-white font-bold">
                          {item.title.charAt(0)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">{item.title}</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={Navpass}
                    className="flex gap-2 mt-4 items-center border-t "
                    key={index}
                  >
                    <div className="relative w-12 h-12 mt-3">
                      <Image
                        src={baseImgURL + item.image}
                        fill
                        className="object-cover  rounded-md"
                      />
                    </div>
                    <p className="font-bold">{item.title}</p>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
      {user && (
        <>
          <div className="flex justify-center mt-7">
            <div className="p-3 bg-white rounded-lg">
              <QRCodeCanvas
                value={`https://wowfy.com/?user_id=${user.username}`}
                imageSettings={{
                  src: "/assets/images/wowcoin.png",
                  height: 35,
                  width: 35,
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex gap-3">
                    <BookOpen color="white" />
                    <p className="no-underline outline-none font-extrabold">
                      {" "}
                      Pages
                    </p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {userPages?.length > 0 &&
                    userPages?.map((item, index) => {
                      return (
                        <Link
                          href={`/pages/${item.id}`}
                          className="flex gap-2 mt-4 items-center border-t"
                          key={index}
                        >
                          <div className="relative w-12 h-12 mt-3">
                            <Image
                              src={baseImgURL + item.icon}
                              fill
                              className="object-cover  rounded-md"
                            />
                          </div>
                          <p className=" text-base font-bold">{item.title}</p>
                        </Link>
                      );
                    })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
