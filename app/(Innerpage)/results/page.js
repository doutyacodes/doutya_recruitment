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

const Results = () => {
  const [todoData, setTodoData] = useState([]);
  const [todoQuizData, setTodoQuizData] = useState([]);
  const [toggleNav, setToggleNav] = useState("Jobs & Internships");

  const user = useAppSelector((state) => state.auth.user);
  const convertStarsToNumber = (stars) => {
    return parseInt(stars);
  };
  useEffect(() => {
    if (!user && !user?.id) {
      return redirect("/signup");
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
          // console.log(response.data);
          if (response.status === 200) {
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
          // Only fetch rewards if user data is available
          const response = await axios.get(
            `${baseURL}/getAlltodoTasksQuiz.php?user_id=${user.id}`
          );
          // console.log(response.data);
          if (response.status === 200) {
            setTodoQuizData(response.data.tasks);
            // console.log(response.data);
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
  const JobsRoute = () => {
    return (
      <div className="flex flex-col gap-2 bg-white px-1">
        {todoData?.length > 0 && (
          <Table>
            <TableCaption>Results.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]"></TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Rounds</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todoData &&
                todoData?.length > 0 &&
                todoData.map((item, itemIndex) => {
                  // console.log(item);
                  let formattedEndDate;
                  let formattedDate;
                  formattedDate = moment(item.start_date).fromNow();
                  const endDate = moment(item.end_date);
                  const now = moment();

                  const duration = moment.duration(endDate.diff(now));

                  if (duration.asDays() >= 1) {
                    formattedEndDate = Math.round(duration.asDays()) + " days";
                  } else if (duration.asHours() >= 1) {
                    formattedEndDate =
                      Math.floor(duration.asHours()) +
                      ":" +
                      (duration.minutes() < 10 ? "0" : "") +
                      duration.minutes() +
                      " hrs";
                  } else {
                    formattedEndDate = duration.minutes() + " minutes";
                  }
                  const maxLength = 12;
                  const slicedTitle = item?.title
                    ? item.title.length > maxLength
                      ? item.title.slice(0, maxLength) + "..."
                      : item.title
                    : "";
                  return (
                    <TableRow key={itemIndex}>
                      <TableCell>
                        <div
                          className={" relative  w-20 h-16 border rounded-lg"}
                        >
                          <Image
                            src={baseImgURL + item.image}
                            fill
                            alt="Profile Image"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.selectedMovie.title}</TableCell>
                      <TableCell className="font-bold">{item.title}</TableCell>
                      <TableCell>
                        {item?.success && (
                          <div
                            className={cn(
                              " rounded-full ",
                              item.success == "yes"
                                ? "bg-green-600"
                                : "bg-red-600"
                            )}
                          >
                            <p className="text-white text-sm font-bold px-7 py-1 text-center flex">
                              {item.success == "yes" ? "Success" : "Failed"}
                            </p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
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
      <div className="flex flex-col gap-2 bg-white px-1">
        {todoQuizData?.length > 0 && (
          <Table>
            <TableCaption>Results.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]"></TableHead>
                <TableHead className="text-center">Company</TableHead>
                <TableHead className="text-center">Title</TableHead>
                <TableHead className="text-center">Rounds</TableHead>
                <TableHead className="text-center">Stars</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todoQuizData &&
                todoQuizData?.length > 0 &&
                todoQuizData.map((item, itemIndex) => {
                  // console.log(item);
                  let formattedEndDate;
                  let formattedDate;
                  formattedDate = moment(item.start_date).fromNow();
                  const endDate = moment(item.end_date);
                  const now = moment();

                  const duration = moment.duration(endDate.diff(now));

                  if (duration.asDays() >= 1) {
                    formattedEndDate = Math.round(duration.asDays()) + " days";
                  } else if (duration.asHours() >= 1) {
                    formattedEndDate =
                      Math.floor(duration.asHours()) +
                      ":" +
                      (duration.minutes() < 10 ? "0" : "") +
                      duration.minutes() +
                      " hrs";
                  } else {
                    formattedEndDate = duration.minutes() + " minutes";
                  }
                  const maxLength = 12;
                  const slicedTitle = item?.title
                    ? item.title.length > maxLength
                      ? item.title.slice(0, maxLength) + "..."
                      : item.title
                    : "";
                  return (
                    <TableRow key={itemIndex}>
                      <TableCell>
                        <div
                          className={" relative  w-20 h-16 border rounded-lg"}
                        >
                          <Image
                            src={baseImgURL + item.image}
                            fill
                            alt="Profile Image"
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.selectedMovie.title}</TableCell>
                      <TableCell className="font-bold">{item.title}</TableCell>
                      <TableCell>
                        {item?.success && (
                          <div
                            className={cn(
                              " rounded-full ",
                              item.success == "yes"
                                ? "bg-green-600"
                                : "bg-red-600"
                            )}
                          >
                            <p className="text-white text-sm font-bold px-7 py-1 text-center flex">
                              {item.success == "yes" ? "Success" : "Failed"}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex w-full justify-center my-4">
                          {item.stars && item.stars !== 0 && (
                            <div className="flex">
                              {/* Check if item.stars is a number */}
                              {console.log(item.stars)}
                              {isNaN(item.stars)
                                ? console.log("item.stars is not a number")
                                : console.log("item.stars is a number")}
                              {Array(parseFloat(item.stars))
                                .fill(0)
                                .map((_, index) => (
                                  <FaStar key={index} color="gold" size={20} />
                                ))}
                            </div>
                          )}
                          {item.stars_left && item.stars_left !== 0 && (
                            <div className="flex">
                              {console.log(item.stars)}
                              {isNaN(item.stars_left)
                                ? console.log("item.stars_left is not a number")
                                : console.log("item.stars_left is a number")}
                              {Array(parseFloat(item.stars_left))
                                .fill(0)
                                .map((_, index) => (
                                  <FaStar key={index} color="gray" size={20} />
                                ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
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
    <div className="w-full p-3">
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
