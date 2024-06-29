"use client";
import { baseImgURL, baseURL } from "@/lib/baseData";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChallengeHomeCard from "../(components)/ChallengeHomeCard";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { isMobile } from 'react-device-detect';

const Results = () => {
  const [todoData, setTodoData] = useState([]);
  const [todoQuizData, setTodoQuizData] = useState([]);
  const [toggleNav, setToggleNav] = useState("Jobs & Internships");
  const [collapseStates, setCollapseStates] = useState([]);

  const toggleCollapse = (index) => {
    const newCollapseStates = [...collapseStates];
    newCollapseStates[index] = !newCollapseStates[index];
    setCollapseStates(newCollapseStates);
  };
  const user = useAppSelector((state) => state.auth.user);
  const convertStarsToNumber = (stars) => {
    return parseInt(stars);
  };
  useEffect(() => {
    if (!user && !user?.id) {
      return redirect("/login");
    }
  }, [user]);
  const handleToggle = (value) => {
    setToggleNav(value);
  };
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "results");
      formData.append("devices", isMobile ? 'mobile devices' : 'desktop devices');

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
  useEffect(() => {
    const fetchTodo = async () => {
      if (user) {
        try {
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getAlltodoTasks.php?user_id=${user.id}`
          );
          console.log(response.data);
          if (response.data?.tasks) {
            setTodoData(response.data.tasks);
            // console.log(response.data);
          } else {
            console.error("Failed to fetch progress");
          }
        } catch (error) {
          console.error("Error while fetching progress:", error.message);
        }
      }
    };

    fetchTodo();
    const fetchTodoQuiz = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/getAlltodoTasksQuiz.php?user_id=${user.id}`
          );
          console.log("Jobs : ", response.data.tasks.length); // Log response data
          if (response.data?.tasks) {
            setTodoQuizData(response.data.tasks);
          } else {
            console.error("Failed to fetch progress");
          }
        } catch (error) {
          console.error("Error while fetching progress:", error.message);
        }
      }
    };

    fetchTodoQuiz();
  }, []);
  const renderStars = (stars) => {
    const numStars = parseFloat(stars);
    const totalStars = 3; // Default number of total stars
    const numGoldStars = isNaN(numStars) || numStars < 0 ? 0 : numStars;
    const numGrayStars = totalStars - numGoldStars;

    return (
      <div className="flex">
        {Array.from({ length: numGoldStars }).map((_, index) => (
          <FaStar key={`gold-${index}`} color="gold" size={20} />
        ))}
        {Array.from({ length: numGrayStars }).map((_, index) => (
          <FaStar key={`gray-${index}`} color="gray" size={20} />
        ))}
      </div>
    );
  };
  // console.log(todoQuizData)
  const JobsRoute = () => {
    return (
      <div className="flex flex-col gap-2 bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4] px-1">
        {/* {console.log("todoData",todoData)} */}

        {todoData?.length > 0 && (
          <Table>
            {/* <TableCaption>Results.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]"></TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Job Title</TableHead>
                <TableHead className="text-center">Round</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todoData &&
                todoData?.length > 0 &&
                todoData.map((item, itemIndex) => {
                  // console.log(item);

                  return (
                    <>
                      <TableRow key={itemIndex}>
                        <TableCell className="text-center">
                          <Link href={`/challenge/${item.challenge_id}`}>
                            <div
                              className={
                                " relative  w-20 h-16 border rounded-lg"
                              }
                            >
                              <Image
                                src={baseImgURL + item?.selectedMovie.image}
                                fill
                                alt="Profile Image"
                                className="rounded-lg object-cover"
                              />
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          {" "}
                          <Link href={`/challenge/${item.challenge_id}`}>
                            {item?.selectedMovie.title}
                          </Link>
                        </TableCell>
                        <TableCell
                          className="font-bold text-center"
                          colSpan={2}
                        >
                          {" "}
                          <Link href={`/challenge/${item.challenge_id}`}>
                            {item?.title}
                          </Link>
                        </TableCell>

                        <TableCell className="text-center">
                         
                        </TableCell>
                        <TableCell>
                          <div className="w-full flex justify-center items-center">
                           {item.rounds[0] &&
                            item.rounds[0].quiz_status != "ongoing" &&( <div
                              className="duration-300 transition-all"
                              onClick={() => toggleCollapse(itemIndex)}
                            >
                              {collapseStates[itemIndex] ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>)}
                          </div>
                        </TableCell>
                      </TableRow>
                      {collapseStates[itemIndex] &&
                        item?.rounds &&
                        item.rounds.map((item2) => {
                          if (
                            item.rounds[0] &&
                            item.rounds[0].quiz_status == "ongoing"
                          ) {
                            return;
                          }
                          return (
                            <TableRow key={item2.number}>
                              <TableCell className="text-center">
                              <Link href={`/challenge/${item.challenge_id}`}>
                            <div
                              className={
                                " relative  w-20 h-16 border rounded-lg"
                              }
                            >
                              <Image
                                src={baseImgURL + item?.selectedMovie.image}
                                fill
                                alt="Profile Image"
                                className="rounded-lg object-cover"
                              />
                            </div>
                          </Link>
                              </TableCell>
                              <TableCell className="text-center">
                                {" "}
                                <Link href={`/challenge/${item.challenge_id}`}>
                                  {item?.selectedMovie.title}
                                </Link>
                              </TableCell>
                              <TableCell className="font-bold text-center">
                                {" "}
                                <Link href={`/challenge/${item.challenge_id}`}>
                                  {item2?.title}
                                </Link>
                              </TableCell>
                              <TableCell className="font-bold text-center">
                                Round {item2.number}
                              </TableCell>

                              <TableCell className="text-center">
                                <Link href={`/challenge/${item.challenge_id}`}>
                                  {item2?.quiz_status && (
                                    <div
                                      className={cn(
                                        " rounded-full ",
                                        item2?.quiz_status == "Success"
                                          ? "bg-green-600"
                                          : item2?.quiz_status == "ongoing"
                                          ? "bg-orange-500"
                                          : "bg-red-600"
                                      )}
                                    >
                                      <p className="text-white text-sm font-bold px-7 py-1 text-center flex">
                                        {item2?.quiz_status == "Success"
                                          ? "Success"
                                          : item2?.quiz_status == "ongoing"
                                          ? "Ongoing"
                                          : "Failed"}
                                      </p>
                                    </div>
                                  )}
                                </Link>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };
  const QuizRoute = () => {
    return (
      <div className="flex flex-col gap-2 bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4] px-1">
        {/* {console.log("Quiz",todoQuizData)} */}
        {todoQuizData?.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]"></TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Quiz</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-center">Stars</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todoQuizData.map((item, itemIndex) => {
                return (
                  <>
                    <TableRow key={itemIndex}>
                      <TableCell className="text-center">
                        <div className={"relative w-20 h-16 border rounded-lg"}>
                          <Image
                            src={baseImgURL + item?.selectedMovie.image}
                            fill
                            alt="Profile Image"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item?.selectedMovie.title}
                      </TableCell>
                      <TableCell className="font-bold text-center">
                        {item?.title}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {item?.total_percent.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex w-full justify-center my-4">
                          {renderStars(item?.stars)}
                        </div>
                      </TableCell>
                    </TableRow>
                    {/* <TableRow>
                    <TableCell colSpan="5">
                      <div className="w-full bg-red-500 p-6 ">

                      </div>
                    </TableCell>
                  </TableRow> */}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  const RenderData = () => {
    switch (toggleNav) {
      case "Jobs & Internships":
        return <JobsRoute />;
      case "Quiz":
        return <QuizRoute />;
      default:
        return <JobsRoute />;
    }
  };
  return (
    <div className="w-full bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4] min-h-[95vh] p-3">
      <div className="flex justify-between items-center shadow">
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Jobs & Internships" && "border-b border-black"
          )}
          onClick={() => handleToggle("Jobs & Internships")}
        >
          Jobs & Internships
        </p>
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Quiz" && "border-b border-black"
          )}
          onClick={() => handleToggle("Quiz")}
        >
          Quiz
        </p>
      </div>
      {RenderData()}
    </div>
  );
};

export default Results;
