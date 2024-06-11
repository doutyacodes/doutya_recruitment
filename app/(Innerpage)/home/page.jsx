"use client";
import { baseImgURL, baseURL } from "@/lib/baseData";
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

const BuzzwallPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterChallenges, setFilterChallenges] = useState([]);
  const [adDetails, setAdDetails] = useState(null);
  const user = useAppSelector((state) => state.auth.user);
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "home");

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
  const fetchAdd = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-ad.php`);
      console.log(response.data.data);
      if (response.data.data) {
        setAdDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserBuzzwall();
    fetchAdd();
  }, []);
  return (
    <div className="max-w-[800px]  min-h-screen bg-white border  w-full mx-auto ">
      <div className="w-full p-1 bg-[#ec1d28]" />
      <div className="w-full  p-3">
        {adDetails && (
          <Link prefetch={false} href={adDetails.link} className="w-full">
            <div className="w-full relative object-contain md:object-cover min-h-24 md:h-40 my-4 rounded-md">
              {adDetails.image && (
                <Image
                  alt="ad-banner"
                  src={baseImgURL + adDetails.image}
                  fill
                  className="rounded-md"
                />
              )}
            </div>
          </Link>
        )}
        <div className="w-full  grid grid-cols-12 gap-3">
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
  );
};

export default BuzzwallPage;
