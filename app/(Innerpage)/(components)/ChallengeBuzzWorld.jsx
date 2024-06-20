import React from "react";
import { baseImgURL } from "@/lib/baseData";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { FaStar } from "react-icons/fa";
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

  return (
    <div
      className={cn(
        "shadow-xl text-xs border rounded-md max-md:w-76 md:min-w-96 bg-white "
      )}
    >
      <Link
        prefetch={false}
        href={`/pages/${item.page_id}`}
        className="px-3 py-1 flex gap-2 items-center"
      >
        <div className=" rounded-full w-10 h-10 relative border">
          <Image
            src={baseImgURL + item.icon}
            fill
            alt="Profile Image"
            className="rounded-full border"
          />
        </div>

        <div>
          <p>
            <span className="font-bold text-xs">{item.page_title}</span> has added{" "}
            {item.page_type == "internship"
              ? `an internship`
              : item.page_type == "job"
              ? `a job`
              : `a quiz`}
          </p>
          {/* <p className="text-xs"> {formattedDate}</p> */}
        </div>
      </Link>
      <Link
        prefetch={false}
        href={
          inTodo
            ? user
              ? `/rounds/${item.challenge_id}`
              : `/challenge/${item.challenge_id}`
            : `/challenge/${item.challenge_id}`
        }
        className=" rounded-md  min-w-72 "
      >
        <div className={" px-3 py-1"}>
          <div className={" relative w-full h-20 "}>
            <Image
              src={baseImgURL + item.image}
              fill
              alt="Profile Image"
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="w-full px-3">
          <div className="w-full flex justify-between items-center">
            <p className={cn("font-bold text-[16px] my-1 whitespace-nowrap truncate")}>
              {slicedTitle}
            </p>
            {item?.success && (
              <div
                className={cn(
                  " rounded-full ",
                  item.success == "yes" ? "bg-green-600" : "bg-red-600"
                )}
              >
                <p className="text-white text-xs font-bold px-7 py-1 text-center flex">
                  {item.success == "yes" ? "Success" : "Failed"}
                </p>
              </div>
            )}
          </div>
          {<div className="h-[1px] bg-slate-300 my-1 w-full" />}
          <div className="w-full flex items-center justify-between">
            <div>
              <p className="text-xs font-light">Deadline</p>
              <p className="text-xs font-extrabold text-slate-600">
                {formattedEndDate}
              </p>
            </div>
            {item.stars && (
              <div className="w-26 pl-3">
                <p className="text-xs font-light text-center">Stars</p>
                <div className="flex gap-1">
                  {Array(parseInt(item.stars))
                    .fill(0)
                    .map((_, index) => (
                      <FaStar key={index} color="gold" size={10} />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChallengeBuzzWorld;
