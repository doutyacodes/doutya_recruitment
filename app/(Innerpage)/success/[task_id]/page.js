"use client";
import { Button } from "@/components/ui/button";
import { baseURL, generateSlug } from "@/lib/baseData";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { FaStar } from "react-icons/fa";

const Success = ({ params }) => {
  const task_id = params.task_id;
  const user = useAppSelector((state) => state.auth.user);
  const [starsDetails, setStarsDetails] = useState(0);
  const [percentageDetails, setPercentageDetails] = useState(0);
  const [types, setTypes] = useState(null);
  const [user_rank, setUser_rank] = useState(null);
  const [pageTypes, setPageTypes] = useState(null);
  const [routes, setRoutes] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [fullData, setFullData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/home");
    }
  }, [user, router]);

  useEffect(() => {
    const getStars = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/get-user-stars.php?user_id=${user.id}&task_id=${task_id}`
        );
        const data = response.data.data;
        console.log(data);
        setFullData(data);

        if (data.stars) setStarsDetails(data);
        if (data.total_percent) setPercentageDetails(data.total_percent);
        if (data.types) setTypes(data.types);
        if (data.page_type) setPageTypes(data.page_type);
        if (data.user_rank) setUser_rank(data.user_rank);
        if (data.url) {
          setRoutes(data.url);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      getStars();
    }
  }, [user, task_id]);

  const total_stars = 3;

  const renderStars = () => {
    const goldStars = starsDetails.stars || 0;
    const grayStars = total_stars - goldStars;
    const stars = [];

    for (let i = 0; i < goldStars; i++) {
      stars.push(<FaStar key={i} color="gold" size={20} />);
    }

    for (let i = 0; i < grayStars; i++) {
      stars.push(<FaStar key={i + goldStars} color="gray" size={20} />);
    }

    return stars;
  };

  return (
    <div className="w-full p-3 h-full">
      <div className="w-full max-w-[1200px] mx-auto">
        {isLoading ? (
          <div className="w-full h-[70vh] justify-center flex items-center">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : (
          <div className="w-full h-full bg-white flex flex-col min-h-[60vh] md:min-h-[80vh] rounded-md justify-center items-center">
            {user_rank && user_rank > 15 ? (
              percentageDetails > 50 ? (
                <IoIosCheckmarkCircle size={90} color="green" />
              ) : (
                <IoMdCloseCircle size={90} color="red" />
              )
            ) : (
              <IoMdCloseCircle size={90} color="red" />
            )}

            {starsDetails.stars > 0 && (
              <div>
                <p className="text-lg text-center my-5 space-y-5 font-bold">
                  Stars Achieved
                </p>
                <div className="flex gap-3 w-full justify-center my-4">
                  {renderStars()}
                </div>
              </div>
            )}
            {types && types !== "compatibility" && percentageDetails > 0 && (
              <div>
                <p className="text-lg text-center space-y-5 font-bold">
                  Your Performance
                </p>
                <p className="w-full text-center my-3 font-bold text-lg">
                  {percentageDetails?.toFixed(2)}%
                </p>
              </div>
            )}
            {/* {user_rank && percentageDetails >= 50 && (
              <div>
                <p className="text-lg text-center space-y-5 font-bold">
                  Your Rank
                </p>
                <p className="w-full text-center my-3 font-bold text-lg">
                Results will be published after 8:45 PM.
                </p>
              </div>
            )} */}
            {types && types === "compatibility" && percentageDetails > 0 && (
              <div>
                <p className="text-lg text-center space-y-5 font-bold">
                  Your Compatibility with Doutya Technologies
                </p>
                <p className="w-full text-center my-3 font-bold text-lg">
                  {percentageDetails?.toFixed(2)}%
                </p>
              </div>
            )}
            {
              <p className=" text-black/80 p-3 text-center">
                {percentageDetails < 50 && fullData?.textData}
              </p>
            }
            <Link prefetch={false} href={`/${routes}`}>
              <Button className="bg-green-600 text-lg">
                {types && types === "compatibility" ? "Go Home" : "Go Back"}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;
