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
import { isMobile } from "react-device-detect";
import { IoCloseCircle } from "react-icons/io5";
const BuzzwallPage = () => {
  const [showImage, setShowImage] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "home");
      formData.append(
        "devices",
        isMobile ? "mobile devices" : "desktop devices"
      );

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
  const filterChallenges = [
    {
      info_type: "challenge",

      challenge_id: "90",

      title: "Web Development Intern",

      description:
        "<div>We are looking for a Web Development intern, who will work remotely on creating and maintaining our web applications. The intern will be responsible for developing web front-end user interfaces using HTML5, CSS, and JavaScript, as well as implementing software features using web frameworks such as React. The intern will work hand in hand with our experienced team, gaining experience on how to develop complex web applications.<br><br><br>This is a PAID 3-month INTERNSHIP with the opportunity for a full-time position. Hours are flexible.<br><br></div>",

      challenge_type: "ordered",

      page_id: "1",

      start_date: "2024-06-24 12:17:32",

      rewards: "yes",

      start_time: "12:16:27",

      end_date: "2024-06-30 16:46:50",

      end_time: "23:59:59",

      entry_points: "0",

      reward_points: "25",

      level: "1",

      created_by: "Admin",

      created_date: "2024-03-26 05:25:12",

      participants_count: "0",

      removed_date: null,

      removed_by: null,

      frequency: "quiz",

      page_type: "internship",

      page_title: "Doutya Technologies",

      icon: "doutya6.png",

      image: "web.png",

      completed: "false",

      referral_count: "0",

      created_at: "24-06-2024 12:17:32",

      selectedTitle: { title: "Doutya Technologies", image: "doutya6.png" },
      interview: "Interview will resume on:",
      time: "05:00 PM",
      interview_date: "28-06-24",
      open_for: "everyone",

      single_task: "no",
      salary: "Rs 8000 / month",

      task_keyword: {
        0: "40",

        1: "90",

        2: "138",

        3: "12",

        id: "40",
        challenge_id: "90",

        task_id: "138",

        keyword_id: "12",
        domain: [
          {
            title: "React Js",
          },
          {
            title: "CSS",
          },
          {
            title: "HTML",
          },
        ],
      },
    },

    {
      info_type: "challenge",

      challenge_id: "78",

      title: "Python",

      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

      challenge_type: "ordered",

      page_id: "1",

      start_date: "2024-06-10 06:09:44",

      rewards: "yes",

      start_time: "00:35:59",

      end_date: "2024-06-30 16:46:50",

      end_time: "27:35:59",

      entry_points: "0",

      reward_points: "25",

      level: "1",

      created_by: "Admin",

      created_date: "2024-06-10 06:09:44",

      participants_count: "0",

      removed_date: null,

      removed_by: null,

      frequency: "quiz",

      page_type: "job",

      page_title: "Doutya Technologies",

      icon: "doutya6.png",

      image: "jr.png",

      completed: "false",

      referral_count: "0",

      created_at: "10-06-2024 06:09:44",

      selectedTitle: { title: "Doutya Technologies", image: "doutya6.png" },

      open_for: "everyone",

      stars: "3",

      single_task: "yes",
      salary: "Rs 25000 - 33000 / month",
      interview: "Interview begins on:",
      time: "08:00 AM",
      interview_date: "01-07-24",
      task_keyword: {
        0: "30",

        1: "78",

        2: "125",

        3: "7",

        id: "30",
        challenge_id: "78",

        task_id: "125",

        keyword_id: "7",
        domain: [
          {
            title: "React Js",
          },
          {
            title: "React Native",
          },
          {
            title: "SQL",
          },
          {
            title: "PHP",
          },
          {
            title: "Python",
          },
        ],
      },
    },

    {
      info_type: "challenge",

      challenge_id: "78",

      title: "Python",

      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",

      challenge_type: "ordered",

      page_id: "1",

      start_date: "2024-06-10 06:09:44",

      rewards: "yes",

      start_time: "00:35:59",

      end_date: "2024-06-30 16:46:50",

      end_time: "27:35:59",

      entry_points: "0",

      reward_points: "25",

      level: "1",

      created_by: "Admin",

      created_date: "2024-06-10 06:09:44",

      participants_count: "0",

      removed_date: null,

      removed_by: null,

      frequency: "quiz",

      page_type: "job",

      page_title: "Doutya Technologies",

      icon: "doutya6.png",

      image: "jfd.png",

      completed: "false",

      referral_count: "0",

      created_at: "10-06-2024 06:09:44",

      selectedTitle: { title: "Doutya Technologies", image: "doutya6.png" },

      open_for: "everyone",

      stars: "3",

      single_task: "yes",
      salary: "Rs 15000 - 22000 / month",
      interview: "Interview begins on:",
      time: "08:00 AM",
      interview_date: "01-07-24",
      task_keyword: {
        0: "30",

        1: "78",

        2: "125",

        3: "7",

        id: "30",
        challenge_id: "78",

        task_id: "125",

        keyword_id: "7",
        domain: [
          {
            title: "React Js",
          },

          {
            title: "SQL",
          },
          {
            title: "PHP",
          },
        ],
      },
    },
  ];

  return (
    <div className="max-w-[800px]  min-h-screen bg-[#fee9c6] border  w-full mx-auto ">
      <div className="w-full p-[2.7px] bg-[#24975c]" />
      {
        showImage && (
          <div className="absolute flex  items-center mx-auto top-0 left-0  z-[999]">
        <div className="relative">
          <div className=" mx-auto flex items-center w-screen h-screen max-w-[800px] justify-center">
            <div className="relative w-72 h-72 md:w-full md:h-full max-h-96 max-w-96">
              <Image
                src={"/assets/images/web-data.png"}
                fill
                className="rounded-md"
                alt="notified"
              />
              <IoCloseCircle
                className="absolute -top-3 -right-3"
                onClick={() => setShowImage(false)}
                color="red"
                size={30}
              />
            </div>
          </div>
        </div>
      </div>
        )
      }
      <div className="w-full  ">
        <div className="w-full h-full ">
          <div className="w-full  grid grid-cols-12 gap-3  p-3">
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
