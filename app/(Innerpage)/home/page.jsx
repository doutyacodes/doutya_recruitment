"use client";
import { baseImgURL, baseURL, generateSlug } from "@/lib/baseData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Posts from "../(components)/Posts";
import moment from "moment";
import ChallengeHomeCard from "../(components)/ChallengeHomeCard";
import ChallengeBuzzWorld from "../(components)/ChallengeBuzzWorld";
import BuzzPosts from "../(components)/BuzzPosts";
import { useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CirclePlus } from "lucide-react";
import { isMobile } from 'react-device-detect';
import MyCompany from "../(components)/MyCompany";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const BuzzwallPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterChallenges, setFilterChallenges] = useState([]);
  const [adDetails, setAdDetails] = useState(null);
  const [userPages, setUserPages] = useState([]);
  const user = useAppSelector((state) => state.auth.user);
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "home");
      formData.append("devices", isMobile ? 'mobile devices' : 'desktop devices');

      const response = await axios.post(
        `${baseURL}/page-visits.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const result = response.data;
      // console.log(result)
      if (result.success) {
        console.log("success");
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  useEffect(() => {
    visitForm();
  }, []);
  const fetchUserBuzzwall = async () => {
    try {
      // Only fetch rewards if user data is available
      const response = await axios.get(
        `${baseURL}/getBuzzWall.php?userId=${user ? user.id : null}`
      );

      // console.log(response.data);
      if (response.status === 200) {
        setFilterChallenges(response.data);
      } else {
        console.error("Failed to fetch buzzwall");
      }
    } catch (error) {
      console.error("Error while fetching buzzwall:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
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
      } finally {
        setIsLoading(false);
      }
    
  };
  const fetchAdd = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-ad.php`);
      // console.log(response.data.data);
      if (response.data.data) {
        setAdDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserBuzzwall();
    fetchUserPages();
    fetchAdd();
  }, []);
  return (
    <div className="  min-h-screen   w-full  ">
      <MyCompany />
      <div className="w-full bg-white h-4" />
      <div className="w-full max-w-[1201px] mx-auto flex">
      <div className="hidden md:flex justify-center items-center w-56 mt-5 h-full">
                <div className="w-full bg-white h-full rounded-md flex flex-col  items-center">
                  <div
                    className={cn(
                      " relative  h-16 rounded-full w-16 border border-black/5 justify-center items-center mt-4"
                    )}
                  >
                    {user?.image?.length > 0 ? (
                      <Image
                        src={baseImgURL + user?.image}
                        fill
                        alt="Profile Image"
                        className="rounded-full object-contain"
                      />
                    ):(
                      <Image
                        src={"/assets/images/avatar.jpg"}
                        fill
                        alt="Profile Image"
                        className="rounded-full object-contain"
                      />
                    )}
                  </div>
                 {user ?( <div className="flex flex-col justify-center gap-4 py-3 font-bold ">
                    <p>{user?.name}</p>
                  </div>
                  ):(
                    <Button className="my-3">
                    <Link prefetch={false} href="/login" className="w-full">
                      Login
                    </Link>
                  </Button>
                  )}
                  
                </div>
              </div>
        <div className="w-full ">
          
          <div className="w-full  grid grid-cols-12 gap-3 p-3 mt-2">
            {filterChallenges?.length > 0 &&
              filterChallenges.map((item, index) => {
                if (item.info_type === "challenge") {
                  let formattedEndDate;
                  let formattedDate;
                  formattedDate = moment(item.start_date).fromNow();
                  const endDate = moment(item.end_date);
                  const now = moment();

                  const duration = moment.duration(endDate.diff(now));

                  if (duration.asDays() >= 1) {
                    formattedEndDate = Math.round(duration.asDays()) + " days";
                  } else if (duration.asHours() >= 1) {
                    formattedEndDate =
                      Math.floor(duration.asHours()) +
                      ":" +
                      (duration.minutes() < 10 ? "0" : "") +
                      duration.minutes() +
                      " hrs";
                  } else {
                    formattedEndDate = duration.minutes() + " minutes";
                  }

                  return (
                    <div className="col-span-12 ">
                      <ChallengeBuzzWorld
                        key={index}
                        item={item}
                        formattedDate={formattedDate}
                        formattedEndDate={formattedEndDate}
                        inPage={true}
                      />
                    </div>
                  );
                } else if (item.info_type === "post") {
                  return (
                    <div className="col-span-12 ">
                      <BuzzPosts key={index} item={item} user_id={1} />
                    </div>
                  );
                }
                return null; // This ensures a proper return value if neither condition is met
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuzzwallPage;
