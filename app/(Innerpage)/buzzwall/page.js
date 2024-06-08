"use client";
import { baseURL } from "@/lib/baseData";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Posts from "../(components)/Posts";
import moment from "moment";
import ChallengeHomeCard from "../(components)/ChallengeHomeCard";
import ChallengeBuzzWorld from "../(components)/ChallengeBuzzWorld";
import BuzzPosts from "../(components)/BuzzPosts";

const BuzzwallPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterChallenges, setFilterChallenges] = useState([]);
  const fetchUserBuzzwall = async () => {
    try {
      // Only fetch rewards if user data is available
      const response = await axios.get(
        `${baseURL}/getBuzzWall.php?userId=${1}`
      );

      if (response.status === 200) {
        setFilterChallenges(response.data);
        // console.log(response.data);
      } else {
        console.error("Failed to fetch buzzwall");
      }
    } catch (error) {
      console.error("Error while fetching buzzwall:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserBuzzwall();
  }, []);
  return (
    <div className="max-w-[800px]  min-h-screen bg-white border  w-full mx-auto ">
      <div className="w-full p-1 bg-[#ec1d28]" />
      <div className="w-full  p-3">
      <div className="w-full  grid grid-cols-12 gap-3">
      {
    filterChallenges?.length > 0 && filterChallenges.map((item, index) => {
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
                <div className="col-span-12 md:col-span-6">
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
                <div className="col-span-12 md:col-span-6">
                <BuzzPosts
                    key={index}
                    item={item}
                    user_id={1}
                />
                </div>
            );
        }
        return null; // This ensures a proper return value if neither condition is met
    })
}

      </div>
      </div>
    </div>
  );
};

export default BuzzwallPage;
