"use client";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/lib/baseData";
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
  const [percentageDetails, setpercentageDetails] = useState(0);
  const [types, setTypes] = useState(null);
  const [routes, setRoutes] = useState("home");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/home");
    }
  }, [user, router]);

  useEffect(() => {
    const getStars = async () => {
      try {
        const response = await axios.get(
          ` ${baseURL}/get-user-stars.php?user_id=${user.id}&task_id=${task_id}`
        );
        console.log(response.data);
        if (response.data.data.stars) {
          setStarsDetails(response.data.data);
        }
        if (response.data.data.page_id) {
          setRoutes("pages/" + response.data.data.page_id);
        }
        if (response.data.data.total_percent) {
          setpercentageDetails(response.data.data.total_percent);
        }
        if (response.data.data.types) {
          setTypes(response.data.data.types);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (user) {
      getStars();
    }
  }, [user, task_id]);
  const total_stars = 3;
  // Function to render stars
  const renderStars = () => {
    const goldStars =
      starsDetails && starsDetails.stars > 0 ? starsDetails.stars : 0; // Number of gold stars
    const grayStars = total_stars - goldStars; // Number of gray stars
    const stars = [];

    // Render gold stars
    for (let i = 0; i < goldStars; i++) {
      stars.push(<FaStar key={i} color="gold" size={20} />);
    }

    // Render gray stars
    for (let i = 0; i < grayStars; i++) {
      stars.push(<FaStar key={i + goldStars} color="gray" size={20} />);
    }

    return stars;
  };

  return (
    <div className="w-full p-3 h-full">
      <div className="w-full h-full bg-white flex flex-col min-h-[60vh] md:min-h-[80vh] rounded-md justify-center items-center">
        {percentageDetails > 34.99 ? (
          <IoIosCheckmarkCircle size={90} color="green" />
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
        {types && types != "compatibility" && percentageDetails > 0 && (
          <div>
            <p className="text-lg text-center space-y-5 font-bold">
              Your Perfomance
            </p>
            <p className="w-full text-center my-3 font-bold text-lg">
              {percentageDetails?.toFixed(2)}%
            </p>
          </div>
        )}
        {types && types == "compatibility" && percentageDetails > 0 && (
          <div>
            <p className="text-lg text-center space-y-5 font-bold">
              Your Compatibility with Doutya Technologies
            </p>
            <p className="w-full text-center my-3 font-bold text-lg">
              {percentageDetails?.toFixed(2)}%
            </p>
          </div>
        )}

        {types && types != "compatibility" && (
          <p className=" text-black/80 p-3">
            {percentageDetails > 34.99 ? (
              <>
                Congratulations! You have successfully completed the first round
                and are eligible for the next round.
              </>
            ) : (
              <>
                Unfortunately, you did not complete the first round. You are
                ineligible for the next round.
              </>
            )}
          </p>
        )}

        <Link prefetch={false} href={`/${routes}`}>
          <Button className="bg-green-600 text-lg">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
