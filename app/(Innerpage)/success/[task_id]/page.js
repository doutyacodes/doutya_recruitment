"use client";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/lib/baseData";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaStar } from "react-icons/fa";

const Success = ({ params }) => {
  const task_id = params.task_id;
  const user = useAppSelector((state) => state.auth.user);
  const [starsDetails, setStarsDetails] = useState(0);
const [routes,setRoutes] = useState("home")
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
          setRoutes("pages/"+response.data.data.page_id);
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
  const goldStars = starsDetails && starsDetails.stars > 0 ? starsDetails.stars : 0; // Number of gold stars
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
        <IoIosCheckmarkCircle size={90} color="green" />
        <p className="text-3xl font-bold text-green-700">Success</p>
        {starsDetails.stars > 0 && (
          <div>
            <p className="text-lg text-center my-5 space-y-5 font-bold">Stars Achieved</p>
            <div className="flex gap-3 w-full justify-center my-4">
              {renderStars()}
            </div>
          </div>
        )}
        {starsDetails.stars > 0 && (
          <div>
            <p className="text-lg text-center space-y-5 font-bold">Your Perfomance</p>
            <p className="w-full text-center mt-3">{starsDetails.total_percent?.toFixed(2)}%</p>
          </div>
        )}
        {/* <p className="text-sm text-black/40 p-3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p> */}
        <Link prefetch={false} href={`/${routes}`}>
          <Button className="bg-green-600 text-lg">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;