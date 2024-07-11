"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseImgURL, baseURL } from "@/lib/baseData";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/app/QuizProvider";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { isMobile } from "react-device-detect";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LobbyScreen = ({ params }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [countdown3, setCountdown3] = useState(-2);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const user = useAppSelector((state) => state.auth.user);
  const task_id = params.task_id;
  const { setQuizDatas } = useGlobalContext();
  const [isQuizStarting, setIsQuizStarting] = useState(false);
  const [isLiveVisible, setIsLiveVisible] = useState(false);
  const [currentTime2, setCurrentTime2] = useState(new Date());
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "quiz-lobby");
      formData.append("task_id", task_id);
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

  useEffect(() => {
    const fetchQuiz = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getSingleQuiz.php?userId=${user?.id}&task_id=${task_id}`
          );
          console.log(response.data);
          if (response.status === 200) {
            setQuizData(response.data.challenges);
            // console.log(response.data)
          } else {
            console.error("Failed to fetch quiz");
          }
        } catch (error) {
          console.error("Error while fetching quiz:", error.message);
        }
      }
    };

    fetchQuiz();
  }, [user, task_id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!quizData) return;
    console.log(quizData.start_time);
    const startTime = new Date(quizData.start_time);
    const timeDifferenceInSeconds = Math.floor(
      (currentTime.getTime() - startTime.getTime()) / 1000
    );

    const quizDurationInSeconds =
      quizData.duration_hours * 3600 + quizData.duration_minutes * 60;

    const calculatedProgressPercentage = Math.min(
      (timeDifferenceInSeconds / quizDurationInSeconds) * 100,
      100
    );

    setProgressPercentage(calculatedProgressPercentage);
  }, [quizData, currentTime]);

  useEffect(() => {
    if (quizData) {
      const [datePart, timePart] = quizData.start_time.split(" ");
      const [day, month, year] = datePart.split("-").map(Number);
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      const quizStartTime = new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
      );

      const differenceInMilliseconds = quizStartTime - currentTime;
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

      if (differenceInMilliseconds <= 0) {
        setCompleted(true);
      } else {
        setCountdown(differenceInSeconds);
        setCountdown3(differenceInSeconds);
      }
    }
  }, [quizData, currentTime]);

  useEffect(() => {
    const convertTime = () => {
      const d = Math.floor(countdown3 / (3600 * 24));
      const h = Math.floor((countdown3 % (3600 * 24)) / 3600);
      const m = Math.floor((countdown3 % 3600) / 60);
      const s = countdown3 % 60;

      // Convert to two digits
      const twoDigitFormat = (num) => String(num).padStart(2, "0");

      setDays(twoDigitFormat(d));
      setHours(twoDigitFormat(h));
      setMinutes(twoDigitFormat(m));
      setSeconds(twoDigitFormat(s));
    };

    convertTime();
  }, [countdown3]);

  useEffect(() => {
    if (quizData && quizData.live === "yes" && countdown3 >= 0) {
      const secondminus = setInterval(() => {
        setCountdown3((prevCount) => prevCount - 1);
      }, 1000);

      return () => clearInterval(secondminus);
    }
  }, [quizData, countdown3]);

  useEffect(() => {
    // if (countdown3 === 0) {
    //   handleQuiz();
    // }
  }, [countdown3]);

  const handleQuiz = () => {
    // if (isQuizStarting) return; // Prevent multiple calls
    console.log("hi")
    setIsQuizStarting(true);

    if (quizData) {
      if (quizData.completed === "true") {
        alert("You can't attempt a quiz again.");
        setIsQuizStarting(false); // Allow future attempts if it's just an alert
      } else {
        gotoQuiz(quizData.challenge_id);
      }
    } else {
      alert("Quiz data is not available.");
      setIsQuizStarting(false); // Allow future attempts if it's just an alert
    }
  };

  const gotoQuiz = async (challenge_id) => {
    try {
      setisLoading(true);
      const response2 = await axios.post(
        `${baseURL}/createUserQuiz.php`,
        {
          user_id: user.id,
          challenge_id: challenge_id,
          task_id: task_id,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response2.data.success) {
        const quizDatas = {
          currentIndex: 0,
          dataQuiz: quizData,
          user: user,
          live: quizData.live,
        };

        const serializedQuizDatas = JSON.stringify(quizDatas);
        await localStorage.setItem("quizDatas", serializedQuizDatas);
        setQuizDatas(quizDatas);
        router.replace("/quiz-page");
      }
    } catch (error) {
      console.error("Error2:", error);
    } finally {
      setisLoading(false);
      setIsQuizStarting(false); // Reset flag
    }
  };

  
  return (
    <div className="w-full  min-h-[85vh]  flex flex-col items-center justify-between">
      {quizData?.icon && (
        <div className="w-full flex justify-center bg-[#f9f9f9] py-3 gap-2 items-center">
          <Image src={baseImgURL + quizData?.icon} width={40} height={40} />
          <p className="font-bold">{quizData.page_title}</p>
        </div>
      )}
      <div className="flex w-full flex-col items-center max-w-[1200px] mx-auto justify-center h-full p-4">
        {quizData ? (
          <button
            className="bg-white shadow-md rounded-lg p-6 m-4 w-full min-h-[60vh] h-full flex flex-col items-center justify-center relative"
            onClick={handleQuiz}
            disabled={quizData.live === "yes" ? true : false}
          >
            {quizData.live == "yes" && (
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="bg-green-600 font-bold text-white rounded-full px-5">
                      Rules
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-72 max-w-96 p-3">
                    <ol className="space-y-4">
                      {[
                        `The test starts exactly at   ${task_id==146 ? "7:00 PM " : "8:00 PM "}, 11-07-24.`,
                        "The timer will not stop even if you click on the answer. The next question will only come when the whole time is over.",
                        `Results will be published after ${task_id == 146 ? "8:45 PM" : "9:45 PM"}.`,
                        "You need to score atleast 50% and be in the top 20 ranks to qualify to the next round.",
                        "Your marks are dependent on how quick and how accurate you are when answering the questions. Answering the questions at the last second is almost the same as getting it wrong.",

                        "You can click the answer only once.",
                        "The first question will appear as soon as the time is over.",
                      ].map((point, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          <span className="font-bold">{index + 1}. </span>
                          {point}
                        </li>
                      ))}
                    </ol>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <span className="text-xl sm:text-3xl font-bold mb-4 uppercase">
              {quizData.title}
            </span>
            {quizData.live === "yes" && !completed && (
              <span className="sm:text-xl text-lg font-semibold my-4">
                The first question will appear in
              </span>
            )}
            {quizData.live === "yes" && completed && (
              <span className="text-center text-red-500 text-lg font-bold">
                Oops!..Quiz has been completed
              </span>
            )}
            {quizData.live === "yes" && !completed && (
              <div className="flex flex-row gap-1 my-4">
                {
                days > 0 && (
                  <div className="text-center">
                    <span className="text-green-500 py-2 text-4xl font-bold">
                      {days}:
                    </span>
                    <span className="block text-sm font-medium mt-3">Days</span>
                  </div>
                )
                }
                <div className="text-center">
                  <span className="text-green-500 py-2 text-4xl font-bold">
                    {hours}:
                  </span>
                  <span className="block text-sm font-medium mt-3">Hours</span>
                </div>
                <div className="text-center">
                  <span className="text-green-500 py-2 text-4xl font-bold">
                    {minutes}:
                  </span>
                  <span className="block text-sm font-medium mt-3">
                    Minutes
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-green-500 py-2 text-4xl font-bold">
                    {seconds}
                  </span>
                  <span className="block text-sm font-medium mt-3">
                    Seconds
                  </span>
                </div>
              </div>
            )}
            {quizData.live === "no"  && (
              <Button
                onClick={handleQuiz}
                disabled={quizData.completed === "true" || isLoading}
                className="px-5 py-3 bg-red-500 rounded-lg text-white font-bold w-full max-w-40 mt-5"
              >
                Start
              </Button>
            )}
             {quizData.live === "yes" && completed &&  (
              <Button
                onClick={handleQuiz}
                // disabled={quizData.completed === "true"}
                className="px-5 py-3 bg-red-500 rounded-lg text-white font-bold w-full max-w-40 mt-5"
              >
                Start
              </Button>
            )} 
            {/* {console.log(quizData.completed)} */}
          </button>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        )}
      </div>
      <div />
    </div>
  );
};

export default LobbyScreen;
