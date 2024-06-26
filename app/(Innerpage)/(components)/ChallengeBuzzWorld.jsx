"use client";
import React, { useEffect, useState } from "react";
import { baseImgURL } from "@/lib/baseData";
import Image from "next/image";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ChallengeBuzzWorld = ({
  item,
  formattedDate,
  formattedEndDate,
  inPage = null,
  inMap = null,
  inTodo = null,
}) => {
  const encodedId = btoa(item.challenge_id);
  const maxLength = 25;
  const slicedTitle = item?.title
    ? item.title.length > maxLength
      ? item.title.slice(0, maxLength) + "..."
      : item.title
    : "";
  const user = useAppSelector((state) => state.auth.user);
  const [imageSrc, setImageSrc] = useState(baseImgURL + item.image);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setImageSrc(baseImgURL + "a" + item.image); // Assuming `item.imageForMd` is the image for md screens
      } else {
        setImageSrc(baseImgURL + item.image);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [item.image]);

  // Create comma-separated list of domains
  const domains = item.task_keyword.domain.map(domain => domain.title).join(", ");
// console.log(item)
  return (
    <div className={cn("shadow-xl text-xs md:text-sm border rounded-md max-md:w-76 md:min-w-96 bg-white")}>
      <div className="rounded-md min-w-72">
        <div className={"px-3 py-1"}>
          <div className={"relative w-full h-24 md:h-56 border rounded-lg"}>
            {
              item.page_type =="internship" && (
                <div className="w-full h-full absolute left-0 top-0 z-50 bg-gray-400/70">

              </div>
              ) 
            }
            <Image
              src={imageSrc}
              fill
              alt="Profile Image"
              className="rounded-lg min-[576px]:object-cover md:object-contain max-[575px]:object-fill"
            />
          </div>
        </div>
        <div className="w-full px-3">
          <div className="w-full flex justify-between items-center">
            <p className={cn("font-bold text-[16px] my-1 whitespace-nowrap text-red-600 truncate")}>
              {item.page_type =="internship" && "New Application Paused."}
            </p>
            <div>
              <p>{item.interview+" "}</p><p className="text-green-600 font-bold">{item.interview_date}, {item.time}</p>
            </div>
          </div>
          <div className="h-[1px] bg-slate-300 my-1 w-full" />
          <div className="grid grid-cols-12 min-h-12">
            <div className="col-span-4 w-full text-center">
              <p className="text-xs md:text-sm font-light">Domain</p>
              <p className="text-xs md:text-sm font-extrabold text-slate-600">
                {domains}
              </p>
            </div>
            <div className="col-span-4 w-full text-center">
              <p className="text-xs md:text-sm font-light">{item.page_type === "job" ? "Salary" : "Stipend"}</p>
              <p className="text-xs md:text-sm font-extrabold text-slate-600">
                {item.salary}
              </p>
            </div>
            <div className="col-span-4 w-full text-center">
              <p className="text-xs md:text-sm font-light">Location</p>
              <p className="text-xs md:text-sm font-extrabold text-slate-600">
                Remote
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBuzzWorld;
