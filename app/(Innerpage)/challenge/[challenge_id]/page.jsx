"use client";
import { baseImgURL, baseURL } from "@/lib/baseData";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Tally3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import UserEligibility from "../../(components)/UserEligibility";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DescriptionText from "../../(components)/DescriptionText";
import RoundSection from "../../(components)/RoundSection";
import { useRouter } from "next/navigation";
const PageDetails = ({ params }) => {
  const user = useAppSelector((state) => state.auth.user);
  // const user = { id: 24 };
  const [showDialog, setShowDialog] = useState(false);
  const [compatibilityTest, setCompatibilityTest] = useState([]);
  const [alreadyStarted, setAlreadyStarted] = useState(false);

  const [toggleNav, setToggleNav] = useState("Description");
  const [challenge, setChallenge] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEligible, setIsEligible] = useState(true);
  const router = useRouter();

  const challenge_id = params.challenge_id;
  useEffect(() => {
    const fetchChallenge = async () => {
      let urlData = "getChallengeOne";

      try {
        setIsLoading(true);

        const response = await axios.get(
          `${baseURL}/${urlData}.php?challenge_id=${challenge_id}&user_id=${
            user ? user.id : null
          }`
        );
        // console.log(response.data);

        if (response.status === 200) {
          setChallenge(response.data);
          if (response.data?.eligibility) {
            const isUserEligible = response.data.eligibility.every(
              (item) => item.stars <= (item.user_stars || 0)
            );
            setIsEligible(isUserEligible);
          }
          if (
            response.data?.page_type == "job" ||
            response.data?.page_type == "internship"
          ) {
            setToggleNav("Rounds");
          }
          // console.log(response.data.eligibility);
          // console.log(response.data);
        } else {
          console.error("Failed to fetch challenges");
        }
      } catch (error) {
        console.error("Error while fetching challenges:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenge();
    fetchData();
    // console.log(challenge.task_id)
  }, []);
  const fetchAlreadyDone = async () => {
    if (user) {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${baseURL}/check-already-exist.php?challenge_id=${challenge_id}&user_id=${
            user ? user.id : null
          }`
        );
        // console.log(response.data);

        if (response.data.success) {
          setAlreadyStarted(true);
        } else {
          console.error("Failed to fetch availablity");
        }
      } catch (error) {
        console.error("Error while fetching availablity:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    const fetchCompilibility = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/get-user-compatibility.php?user_id=${
              user?.id ? user.id : null
            }&page_id=1`
          );
          console.log(response.data);
          if (response.data.success) {
            setCompatibilityTest(response.data.data);
          }
        } catch (error) {
          console.error("Error while fetching compatibility");
        }
      }
    };
    fetchCompilibility();
    fetchAlreadyDone();
  }, [user, challenge_id]);
  const fetchData = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before fetching data
      // console.log(challenge)
      const response = await axios.get(
        `${baseURL}/getDetailsInnerpage.php?challenge_id=${challenge_id}`
      );

      // console.log(response.data);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Error while fetching data:", error.message);
    } finally {
      setIsLoading(false); // Set isLoading to false if an error occurs
    }
  };
  const DescriptionRoute = () => {
    return (
      <div className="mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] mb-7">
        <div className="w-full h-full  space-y-5 mt-3">
          <div className="mt-4 justify-center flex flex-col gap-3 items-center w-full p-3">
            <div className=" w-24 h-24  rounded-md relative">
              {challenge.image && (
                <Image
                  src={baseImgURL + challenge.image}
                  fill
                  alt="image"
                  objectFit="cover"
                  className="rounded-md"
                />
              )}
            </div>
            <h3 className="font-bold text-center text-lg">{challenge.title}</h3>
            <p>
              <DescriptionText rules={challenge.description} />
            </p>
          </div>
        </div>
      </div>
    );
  };
  const RulesRoute = () => {
    return (
      <div className="mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] p-4">
        {challenge?.rules ? (
          <div className="mt-4 mb-6">
            <p>
              <DescriptionText rules={challenge.rules} />
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-center mt-3">
            No rules found
          </div>
        )}
      </div>
    );
  };
  const SalaryRoute = () => {
    return (
      <div className="mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] p-4">
        <div className="flex gap-4 items-center">
          <h6 className="text-lg font-semibold">
            {" "}
            {challenge.page_type == "job" ? "Salary" : "Stipend"} :
          </h6>
          <h3 className="text-2xl md:text-2xl font-bold">
            ₹{" "}
            {challenge?.salary ? challenge.salary.toLocaleString("en-IN") : ""}{" "}
            / month
          </h3>
        </div>
        {challenge?.salary_desc && (
          <div className="mt-4 mb-6">
            <DescriptionText rules={challenge.salary_desc} />
          </div>
        )}
      </div>
    );
  };
  const EligibilityRoute = () => {
    return (
      <div className="mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] p-4">
        <div className=" w-full">
          {challenge?.eligibility?.length > 0 ? (
            challenge?.eligibility.map((item, index) => {
              return <UserEligibility key={index} item={item} />;
            })
          ) : (
            <div className="w-full justify-center items-center flex h-full min-h-[30vh]">
              <p className="font-bold text-lg">No stars required</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  const StarsRoute = () => {
    return (
      <div className=" mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] p-4">
        <div className=" w-full">
          {challenge.stars && (
            <div className="w-full flex flex-col space-y-5 justify-center items-center">
              {/* <p className="text-xs font-light text-center">Stars</p> */}
              <div className="flex gap-1">
                {Array(parseInt(challenge.stars, 10))
                  .fill(0)
                  .map((_, index) => (
                    <FaStar key={index} color="gold" size={40} />
                  ))}
              </div>
              <p className="text-center text-slate-400">
                You can gain upto {challenge.stars} stars.
              </p>
              {challenge?.star_description && (
                <div className="mt-4 mb-6">
                  <DescriptionText rules={challenge.star_description} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const RoundsRoute = () => {
    return (
      <div className=" mt-2 bg-white rounded-md w-full flex-1  h-full overflow-scroll min-h-[70vh] p-4 mb-9">
        <div className=" w-full flex items-center flex-col justify-center">
          <div className=" w-24 h-24  rounded-md relative">
            {challenge.image && (
              <Image
                src={baseImgURL + challenge.image}
                fill
                alt="image"
                objectFit="cover"
                className="rounded-md"
              />
            )}
          </div>
          <h3 className="font-bold text-center text-lg">{challenge.title}</h3>
        </div>
        <div className="w-full flex flex-col gap-5 mt-5">
          <div className="w-full flex flex-col gap-3 justify-center items-center">
            <p className="font-bold ">Round 1</p>
            <div
              onClick={() => {
                if (alreadyStarted && user && !compatibilityTest?.completed) {
                  router.push(`/quiz-lobby/${compatibilityTest.task_id}`);
                }
              }}
              className={cn(
                "p-3 justify-center duration-300 min-h-32 transition-all ease-in-out items-center rounded-full w-full flex flex-col gap-3",
                !user || !alreadyStarted
                  ? "bg-gray-500"
                  : user && !compatibilityTest?.completed
                  ? "bg-gradient-to-r from-orange-500 to-orange-700"
                  : compatibilityTest?.completed &&
                    compatibilityTest.compatibility >=
                      (challenge.page_type === "job" ? 60 : 50)
                  ? "bg-gradient-to-r from-green-500 to-green-700"
                  : compatibilityTest?.completed &&
                    compatibilityTest.compatibility <
                      (challenge.page_type === "job" ? 60 : 50)
                  ? "bg-gradient-to-r from-red-500 to-red-700"
                  : "bg-gray-400"
              )}
            >
              <p className="text-center font-bold tracking-wider text-xl text-white underline uppercase">
                Compatibility
              </p>
              <p className="text-center font-bold text-base text-white ">
                {compatibilityTest?.completed
                  ? compatibilityTest.compatibility
                  : 0}
                %
              </p>
              <p className="text-center font-semibold text-sm text-white">
                Required compatibility -{" "}
                {challenge.page_type === "job" ? "60" : "50"}%
              </p>
            </div>
          </div>
          {challenge?.eligibility?.map((item, index) => {
            let color;
            // console.log(item)
            if (!alreadyStarted || !compatibilityTest.completed) {
              color = "bg-gray-400"; // If compatibility test not completed, stay gray
            } else if (
              compatibilityTest.completed &&
              compatibilityTest?.compatibility <
                (challenge.page_type === "job" ? 60 : 50)
            ) {
              color = "bg-red-500";
              // {console.log(compatibilityTest.compatibility)}
            } else if (item.eligible) {
              color = "bg-green-500";
            } else if (
              index === 0 &&
              compatibilityTest.completed &&
              compatibilityTest?.compatibility >
                (challenge.page_type === "job" ? 60 : 50)
            ) {
              color = "bg-orange-500";
            } else if (
              index > 0 &&
              challenge.eligibility[index - 1].isEligible
            ) {
              color = "bg-orange-500";
            } else {
              color = "bg-gray-400";
            }
            return (
              <RoundSection
                key={index}
                item={item}
                index={index}
                color={color}
                timerValue={(index + 1) * 1000}
              />
            );
          })}
          <div className="w-full flex flex-col gap-3 justify-center items-center">
            <p className="font-bold ">
              Round{" "}
              {challenge?.eligibility?.length > 0
                ? challenge?.eligibility?.length + 2
                : 2}
            </p>

            <div
              onClick={() => {
                alreadyStarted &&
                  compatibilityTest?.completed &&
                  compatibilityTest?.compatibility >=
                    (challenge.page_type == "job" ? 60 : 50) &&
                  isEligible &&
                  router.push(`/quiz-lobby/${challenge.task_id}`);
              }}
              className={cn(
                "p-3 min-h-32 justify-center duration-300 transition-all ease-in-out  items-center bg-gradient-to-r rounded-full w-full flex flex-col gap-3",
                alreadyStarted &&
                  compatibilityTest.completed &&
                  compatibilityTest?.compatibility >=
                    (challenge.page_type == "job" ? 60 : 50) &&
                  isEligible &&
                  user
                  ? "from-orange-500 to-orange-700"
                  : "from-gray-500 to-gray-400"
              )}
            >
              <p className="text-center font-bold text-xl text-white underline uppercase"></p>
              <p className="text-center font-bold text-base text-white "></p>
              <p className="text-center font-semibold text-sm text-white">
                Final Round
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const RenderData = () => {
    switch (toggleNav) {
      case "Description":
        return <DescriptionRoute />;
      case "Rules":
        return <RulesRoute />;
      case "Salary":
        return <SalaryRoute />;
      case "Eligibility":
        return <EligibilityRoute />;
      case "Stars":
        return <StarsRoute />;
      case "Rounds":
        return <RoundsRoute />;
      default:
        return <DescriptionRoute />;
    }
  };
  const handleToggle = (value) => {
    setToggleNav(value);
  };
  const gotoQuiz = async () => {
    try {
      const response2 = await axios.post(
        `${baseURL}/create-job-start.php`,
        {
          user_id: user.id,
          challenge_id: challenge_id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // console.log(response2.data);
      if (response2.data.success) {
        setAlreadyStarted(true);
      }
    } catch (error) {
      console.error("Error2:", error);
    } finally {
      setIsEligible(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <div className=" w-full h-full flex flex-1 justify-center items-center ">
          <div role="status">
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
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="mt-3 px-3 py-2 h-full relative ">
          <div className="w-full bg-white shadow-lg border border-muted p-3 rounded-md flex justify-between items-center">
            <div className="w-fit border rounded-full">
              <div className=" w-20 h-20  rounded-md relative">
                {selectedMovie.image && (
                  <Image
                    src={baseImgURL + selectedMovie.image}
                    fill
                    alt="image"
                    objectFit="cover"
                  />
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold">{selectedMovie.title}</p>
            </div>
            <div></div>
          </div>
          <div className="flex justify-between items-center shadow rounded-md">
            {(challenge.page_type == "job" ||
              challenge.page_type == "internship") && (
              <p
                className={cn(
                  "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                  toggleNav == "Rounds" && "border-b border-black"
                )}
                onClick={() => handleToggle("Rounds")}
              >
                Rounds
              </p>
            )}
            <p
              className={cn(
                "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                toggleNav == "Description" && "border-b border-black"
              )}
              onClick={() => handleToggle("Description")}
            >
              Description
            </p>
            <p
              className={cn(
                "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                toggleNav == "Rules" && "border-b border-black"
              )}
              onClick={() => handleToggle("Rules")}
            >
              Rules
            </p>
            {challenge.page_type != "tests" &&
              challenge.page_type != "language" && (
                <>
                  <p
                    className={cn(
                      "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                      toggleNav == "Salary" && "border-b border-black"
                    )}
                    onClick={() => handleToggle("Salary")}
                  >
                    {challenge.page_type == "job" ? "Salary" : "Stipend"}{" "}
                  </p>
                  <p
                    className={cn(
                      "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                      toggleNav == "Eligibility" && "border-b border-black"
                    )}
                    onClick={() => handleToggle("Eligibility")}
                  >
                    Eligibility
                  </p>
                </>
              )}
            {(challenge.page_type == "tests" ||
              challenge.page_type == "language") && (
              <>
                <p
                  className={cn(
                    "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
                    toggleNav == "Stars" && "border-b border-black"
                  )}
                  onClick={() => handleToggle("Stars")}
                >
                  Stars
                </p>
              </>
            )}
          </div>
          {RenderData()}
          {!alreadyStarted && (
            <Button className="bg-[#0d988c] px-3 max-w-[600px] fixed p-4 left-1/2 bottom-24 transform -translate-x-1/2 -translate-y-1/4">
              {isEligible && challenge.page_type == "tests" ? (
                <Link
                  prefetch={false}
                  href={
                    user &&
                    (challenge.page_type != "tests" ||
                      challenge.page_type != "language")
                      ? `/rounds/${challenge.challenge_id}`
                      : user &&
                        (challenge.page_type != "tests" ||
                          challenge.page_type != "language")
                      ? `/quiz-lobby/${challenge.task_id}`
                      : "/signup"
                  }
                  className="w-full text-lg"
                >
                  {challenge.page_type != "tests" ||
                  challenge.page_type != "language"
                    ? "Start"
                    : "Apply"}
                </Link>
              ) : (
                <div
                  onClick={() => {
                    if (
                      user &&
                      (challenge.page_type == "job" ||
                        challenge.page_type == "internship")
                    ) {
                      console.log("hello");
                      gotoQuiz();
                    }
                  }}
                  className="w-full text-center cursor-pointer"
                >
                  Apply
                </div>
              )}
              <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogTrigger asChild>
                  <div />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Not Eligible</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are not eligible for this job. Please review the
                      eligibility criteria before proceeding.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>OK</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Button>
          )}
        </div>
      )}
    </>
  );
};

export default PageDetails;
