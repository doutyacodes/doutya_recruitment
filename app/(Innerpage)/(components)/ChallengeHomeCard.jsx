import React from "react";
import { baseImgURL } from "@/lib/baseData";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { FaStar } from "react-icons/fa";

const ChallengeHomeCard = ({
  item,
  formattedDate,
  formattedEndDate,
  inPage = null,
  inMap = null,
  inTodo = null,
}) => {
  const encodedId = btoa(item.challenge_id);
  const maxLength = 12;
  const slicedTitle = item?.title;
  // ? item.title.length > maxLength
  //   ? item.title.slice(0, maxLength) + "..."
  //   : item.title
  // : "";
  const user = useAppSelector((state) => state.auth.user);
  // console.log(item)
  return (
    <Link
      prefetch={false}
      href={`/challenge/${item.challenge_id}`}
      className={cn("shadow-xl rounded-md max-md:w-76 md:min-w-96 bg-white ")}
    >
      <div>
        <div className="block">
          <div className="p-3 space-y-3 flex rounded border items-center px-3 gap-3 min-w-72 w-full">
            <div className="relative md:h-24 md:w-32 w-20 h-16 border rounded-md">
              <Image
                src={baseImgURL + item.image}
                fill
                alt="Profile Image"
                className="rounded-lg object-cover"
              />
            </div>
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                <p className={cn("font-bold whitespace-nowrap truncate")}>
                  {slicedTitle}
                </p>
                {item?.success && (
                  <div
                    className={cn(
                      "rounded-full ",
                      item.success == "yes" ? "bg-green-600" : "bg-red-600"
                    )}
                  >
                    <p className="text-white text-sm font-bold px-7 py-1 text-center flex">
                      {item.success == "yes" ? "Success" : "Failed"}
                    </p>
                  </div>
                )}
              </div>
              <div className="h-[1px] bg-slate-300 my-1 w-full" />
              <div className="w-full flex items-center justify-between">
                <div>
                  <p className="text-xs font-light">Deadline</p>
                  <p className="text-xs font-semibold text-slate-600">
                    {formattedEndDate}
                  </p>
                </div>
                {item.page_type && item.page_type !== "tests" ? (
                  <>
                    {item?.eligible && user && item.eligible === "yes" ? (
                      <div className="w-10 h-10 relative">
                        <Image
                          src="/assets/images/e-green.png"
                          layout="fill"
                          alt="eligible"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 relative">
                        <Image
                          src="/assets/images/e-red.png"
                          layout="fill"
                          alt="not eligible"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.stars && (
                      <div className="w-26">
                        <p className="text-xs font-light text-center">Stars</p>
                        <div className="flex gap-1">
                          {Array(parseInt(item.stars, 10))
                            .fill(0)
                            .map((_, index) => (
                              <FaStar key={index} color="gold" size={12} />
                            ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChallengeHomeCard;
