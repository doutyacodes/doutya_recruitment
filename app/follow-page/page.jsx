"use client";
import { baseImgURL, baseURL } from "@/lib/baseData";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Image from "next/image";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { editUser } from "@/lib/features/authSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FollowPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(()=>{
    if (!user) {
        router.replace("/signup");
      }
  },[user])
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [pages, setPages] = useState([]);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const handleMovieSelection = (pageId) => {
    setSelectedEvents((prevSelectedMovies) => {
      if (prevSelectedMovies.includes(pageId)) {
        return prevSelectedMovies.filter((id) => id !== pageId);
      } else {
        return [...prevSelectedMovies, pageId];
      }
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/getAllPages.php`,
          {
            text: text,
            // type: ["places"] // Convert to JSON string
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        // console.log(response);

        if (response.status === 200) {
          setPages(response.data);
        } else {
          console.error("Invalid response format or failed to fetch pages");
          setPages([]);
        }
      } catch (error) {
        console.error("Error while fetching pages:", error.message);
      }
    };

    fetchMovies();
  }, [text]); // Include selectedTopic in the dependency array

  const dispatch = useAppDispatch();
  const continueToNextScreen = async () => {
    if (selectedEvents.length >= 1) {
      const selectedEventsWithImages = selectedEvents.map((pageId) =>
        pages.find((page) => page.id === pageId)
      );

      const data = {
        userId: user.id,
        selectedEvents: selectedEventsWithImages,
      };
      try {
        const response = await axios.post(`${baseURL}/follow.php`, data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        // console.log(response.data)
        dispatch(editUser({ steps: 3 }));
        router.replace("/home");
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
      }
    } else {
      alert("Please follow at least 1 page to continue.");
    }
  };
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };
  return (
    <div className="max-w-[800px]  min-h-screen overflow-y-scroll w-full mx-auto bg-white border p-3 relative flex flex-col gap-4">
      <div className="flex flex-col gap-3 justify-center items-center">
      <div className="relative w-32 h-24">
          <Image
            src={"/assets/images/doutya4.png"}
            fill
            alt="logo"
            objectFit="contain"
          />
        </div>
        <div className="mb-5">
          <p className="font-bold text-lg">Follow atleast 1 page to continue</p>
        </div>
        {/* <div className=" p-3 bg-white shadow border border-s-slate-100 w-full flex justify-between items-center rounded-md cursor-text">
          <p className="text-sm">Search...</p>
          <FaMagnifyingGlass color="gray" />
        </div> */}
        <div className="mt- grid grid-cols-12 gap-4 w-full h-full">
          {pages?.length > 0 &&
            pages?.map((item, index) => {
              return (
                <div
                  onClick={() => handleMovieSelection(item.id)}
                  className={cn(
                    "relative md:col-span-4 col-span-6 shadow-md flex-col items-center rounded-md border gap-3 flex justify-center p-2 w-full h-full",
                    selectedEvents.includes(item.id)
                      ? "bg-blue-300 shadow-blue-400 border-blue-300"
                      : "bg-white border-black/5"
                  )}
                  key={index}
                >
                  <div className="relative min-h-40 md:h-40 md:min-w-20 h-full rounded-md w-full">
                   {item.icon &&( <Image
                      className="rounded-md"
                      src={`${baseImgURL + item.icon}`}
                      fill
                      alt="image"
                      objectFit="contain"
                    />)}
                  </div>
                  <p className="font-extrabold text-sm">{item.title}</p>
                </div>
              );
            })}
        </div>
        <Button
          onClick={continueToNextScreen}
          className="bg-green-600 text-white font-bold mt-4"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default FollowPage;
