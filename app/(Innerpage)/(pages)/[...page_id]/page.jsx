"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { baseImgURL, baseURL, generateSlug } from "@/lib/baseData";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FaEdit } from "react-icons/fa";
import Posts from "@/app/(Innerpage)/(components)/Posts";
import moment from "moment";
import ChallengeHomeCard from "@/app/(Innerpage)/(components)/ChallengeHomeCard";
import { useAppSelector } from "@/lib/hooks";
import { useParams, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdInformationCircleOutline } from "react-icons/io";
import ProgressCard from "../../(components)/ProgressCard";
import { FaAngleLeft } from "react-icons/fa6";
import { isMobile } from "react-device-detect";
import { CirclePlus } from "lucide-react";
import MyCompany from "../../(components)/MyCompany";

const PageDetails = () => {
  const user = useAppSelector((state) => state.auth.user);
  // const user = { id: 1 };

  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [postData, setPostData] = useState([]);
  const [quizState, setQuizState] = useState([]);
  const [privateQuiz, setPrivateQuiz] = useState([]);
  const [progressDetails, setProgressDetails] = useState([]);
  const [progressDetailspublic, setProgressDetailspublic] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [keywordsList, setKeywordsList] = useState([]);
  const [compatibiltyTest, setCompatibiltyTest] = useState([]);
  const [jobCount, setJobCount] = useState([]);
  const [page_id, setPage_id] = useState(null);
  const [activeRouteIndex, setActiveRouteIndex] = useState("second");
  const [activeThirdIndex, setActiveThirdIndex] = useState(null);
  // const [activeSecondRouteIndex, setActiveSecondRouteIndex] = useState(0);
  const router = useRouter();
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "pages");
      formData.append("page_id", page_id);
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
      // console.log(result)
      if (result.success) {
        console.log("success");
      } else {
        // console.log(result.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true);
// console.log(params.page_id[0])
        const response = await axios.get(
          `${baseURL}/get-slug.php?slug=${params.page_id[1]}`
        );
        // console.log(response.data)
        if (response.data.success) {
          setPage_id(response.data.data.id);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [page_id]);
  useEffect(() => {
    // if(user){
    //   console.log(user)
    // }
    if (user && user?.steps) {
      if (user.steps == 1) {
        router.replace("/choose-keyword/1");
      }
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      // if (!user || !user?.id) {
      //   // If user or user?.id doesn't exist, skip the fetch
      //   return;
      // }
      setIsLoading(true);
      const [postsResponse, movieResponse] = await Promise.all([
        axios.get(
          `${baseURL}/getPagePosts.php?page_id=${page_id}&userId=${
            user?.id ? user.id : null
          }`
        ),

        axios.get(
          `${baseURL}/getDetailsInnerpage.php?id=${page_id}&userId=${
            user?.id ? user.id : null
          }`
        ),
      ]);
      // Update state in batch
      setPostData(postsResponse.data);
      setSelectedMovie(movieResponse.data);
      // console.log(movieResponse.data)
      setIsFollowing(movieResponse.data.following == "true" ? true : false);
    } catch (error) {
      console.error("Error while fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, page_id]);
  useEffect(() => {
    // console.log(activeRouteIndex);

    const fetchKeywords = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/get-user-keywords.php?user_id=${
            user?.id ? user.id : null
          }`
        );
        if (response.data.success) {
          const keywords = response.data.data;
          setKeywordsArray(keywords);

          // Set the first keyword as active when in the "second" route
          // if (activeRouteIndex != "second" && keywords.length > 0) {
          //   setActiveSecondRouteIndex(keywords[0].id);
          // }
        }
      } catch (error) {
        console.error("Error while fetching quiz");
      }
    };

    if (page_id) {
      fetchKeywords();
    }
    const fetchAllKeywords = async () => {
      try {
        const response = await axios.get(`${baseURL}/keywords.php`);
        // console.log(response.data)
        setKeywordsList(response.data);
      } catch (error) {
        console.error("Error while fetching quiz");
      }
    };

    if (page_id) {
      fetchAllKeywords();
    }
    const fetchPrivateQuiz = async () => {
      if (activeRouteIndex == "second") {
        if (activeRouteIndex && activeThirdIndex) {
          try {
            const response = await axios.get(
              `${baseURL}/getEachTestQuiz.php?userId=${
                user?.id ? user.id : null
              }&page_id=${page_id}&page_type=${activeRouteIndex}&type_check=${activeThirdIndex}`
            );
            // console.log(response.data);
            if (response.data) {
              setQuizData(response.data);
            } else {
              setQuizData([]);
            }
          } catch (error) {
            console.error("Error while fetching quiz");
          }
        }
      }
    };
    if (page_id) {
      fetchPrivateQuiz();
    }
    const fetchQuizTest = async () => {
      if (activeRouteIndex == "second") {
        if (activeRouteIndex) {
          try {
            const response = await axios.get(
              `${baseURL}/getEachQuizKeywords.php?userId=${
                user?.id ? user.id : null
              }&page_id=${page_id}&page_type=${activeRouteIndex}`
            );
            // console.log(response.data);
            if (response.data) {
              setPrivateQuiz(response.data);
            }
          } catch (error) {
            console.error("Error while fetching quiz");
          }
        }
      }
    };

    const fetchProgress = async () => {
      if (user && page_id) {
        if (activeRouteIndex) {
          try {
            const response = await axios.get(
              `${baseURL}/get-all-levels.php?userId=${user.id}&page_id=${page_id}`
            );
            // console.log(response.data);
            if (response.data) {
              setProgressDetails(response.data);
            }
          } catch (error) {
            console.error("Error while fetching levels");
          }
        }
      }
    };
    if (page_id) {
      fetchProgress();
    }
    const fetchProgresspublic = async () => {
      if (user) {
        if (activeRouteIndex) {
          try {
            const response = await axios.get(
              `${baseURL}/get-all-levels-public.php?userId=${user.id}&page_id=${page_id}`
            );
            // console.log(response.data);
            if (response.data) {
              setProgressDetailspublic(response.data);
            }
          } catch (error) {
            console.error("Error while fetching quiz");
          }
        }
      }
    };
    fetchProgresspublic();
    const fetchCount = async () => {
      if (activeRouteIndex) {
        try {
          const response = await axios.get(
            `${baseURL}/get-all-jobs-count.php?userId=${
              user ? user.id : null
            }&page_id=${page_id}&page_type=${activeRouteIndex}`
          );
          // console.log(response.data);
          if (response.data.success) {
            setJobCount(response.data.data);
          }
        } catch (error) {
          console.error("Error while fetching count");
        }
      }
    };
    if (page_id) {
      fetchCount();
    }
  }, [activeRouteIndex, user?.id, page_id, activeThirdIndex]);
  useEffect(() => {
    if (page_id) {
      visitForm();
      fetchData();
    }
  }, [page_id, user]);
  useEffect(() => {
    const fetchCompilibility = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${baseURL}/get-user-compatibility.php?user_id=${
              user?.id ? user.id : null
            }&page_id=1`
          );
          // console.log(response.data);
          if (response.data.success) {
            setCompatibiltyTest(response.data.data);
          }
        } catch (error) {
          console.error("Error while fetching compatibility");
        }
      }
    };
    if (page_id) {
      fetchCompilibility();
    }
  }, [user, page_id]);
  useEffect(() => {
    const fetchQuiz = async () => {
      if (activeRouteIndex == "fourth" || activeRouteIndex == "third") {
        if (activeRouteIndex && activeThirdIndex) {
          // console.log(activeRouteIndex);
          try {
            const response = await axios.get(
              `${baseURL}/getEachQuiz.php?userId=${
                user?.id ? user.id : null
              }&page_id=${page_id}&page_type=${activeRouteIndex}&type_check=${activeThirdIndex}`
            );
            // console.log(response.data);
            if (response.data) {
              setQuizState(response.data);
            } else {
              setQuizState([]);
            }
          } catch (error) {
            console.error("Error while fetching quiz");
          }
        }
      }
    };
    if (page_id) {
      fetchQuiz();
    }
  }, [activeRouteIndex, activeThirdIndex]);

  const [routes] = useState([
    // { key: "sixth", title: "Posts" },
    { key: "second", title: "Tests" },
    { key: "third", title: "Jobs" },
    { key: "fourth", title: "Internship" },
    { key: "fifth", title: "Progress" },
  ]);

  const ThirdRoute = () => {
    return (
      <div className="w-full h-full p-1 space-y-4">
        <div className="w-full grid-cols-12 gap-3 grid text-black">
          {activeThirdIndex && (
            <div className="col-span-12 ">
              <div
                onClick={() => setActiveThirdIndex(null)}
                className=" flex gap-3 items-center cursor-pointer w-fit"
              >
                <FaAngleLeft size={24} color="black" />
                <p className="font-bold">Back</p>
              </div>
            </div>
          )}
          {!activeThirdIndex && (
            <>
              <div
                onClick={() => setActiveThirdIndex("software")}
                className="col-span-12 mt-3 rounded-md flex justify-between items-center shadow-lg relative cursor-pointer bg-[#33c9e4] py-2 px-3 mx-3"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-7xl font-bold text-center">T</h1>
                  <p className="font-bold text-center text-xs">Technical</p>
                </div>
                <div className="text-sm font-bold">
                  {jobCount?.technical ? jobCount.technical : 0}{" "}
                  {activeRouteIndex === "third"
                    ? jobCount?.technical === 1
                      ? "Job"
                      : "Jobs"
                    : jobCount?.technical === 1
                    ? "Internship"
                    : "Internships"}{" "}
                  available
                </div>
              </div>
              <div
                onClick={() => setActiveThirdIndex("management")}
                className="col-span-12 rounded-md flex flex-row-reverse justify-between items-center shadow-lg relative cursor-pointer bg-[#fac575] py-2 px-3 mx-3"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-7xl font-bold text-center">M</h1>
                  <p className="font-bold text-center text-xs">Management</p>
                </div>
                <div className="text-sm font-bold">
                  {jobCount?.management ? jobCount.management : 0}{" "}
                  {activeRouteIndex === "third"
                    ? jobCount?.management === 1
                      ? "Job"
                      : "Jobs"
                    : jobCount?.management === 1
                    ? "Internship"
                    : "Internships"}{" "}
                  available
                </div>
              </div>
              <div className="col-span-12 rounded-md flex justify-between items-center shadow-lg relative cursor-pointer bg-[#75c669] py-2 px-3 mx-3">
                <div className="flex flex-col gap-2">
                  <h1 className="text-7xl font-bold text-center">O</h1>
                  <p className="font-bold text-center text-xs">Others</p>
                </div>
                <div className="text-sm font-bold">
                  0 {activeRouteIndex === "third" ? "Jobs" : "Internships"}{" "}
                  available
                </div>
              </div>
            </>
          )}
        </div>
        {activeThirdIndex &&
          quizState?.challenges_by_district &&
          Object.keys(quizState.challenges_by_district).length > 0 &&
          Object.keys(quizState.challenges_by_district).map(
            (districtName, index) => (
              <div className="bg-white w-full p-2 rounded-md" key={index}>
                <p className="font-bold mb-2">{districtName}</p>
                <div className="flex gap-2 w-full overflow-x-scroll">
                  {quizState.challenges_by_district[districtName] &&
                    quizState.challenges_by_district[districtName].length > 0 &&
                    quizState.challenges_by_district[districtName].map(
                      (item, itemIndex) => {
                        let formattedEndDate;
                        let formattedDate;
                        formattedDate = moment(item.start_date).fromNow();
                        const endDate = moment(item.end_date);
                        const now = moment();

                        const duration = moment.duration(endDate.diff(now));

                        if (duration.asDays() >= 1) {
                          formattedEndDate =
                            Math.round(duration.asDays()) + " days";
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

                        return (
                          <ChallengeHomeCard
                            key={itemIndex}
                            item={item}
                            formattedDate={formattedDate}
                            formattedEndDate={formattedEndDate}
                            inPage={true}
                            districtName={districtName}
                          />
                        );
                      }
                    )}
                </div>
              </div>
            )
          )}
      </div>
    );
  };

  const SixthRoute = () => {
    return (
      <div className="w-full h-full grid grid-cols-12 gap-3 p-3">
        {postData?.length > 0 &&
          postData?.map((item, index) => {
            return (
              <Posts
                key={index}
                item={item}
                user_id={user?.id ? user?.id : null}
              />
            );
          })}
      </div>
    );
  };
  const TestRoute = () => {
    return (
      <div className="w-full  h-full   space-y-4">
        <div className="w-full space-y-5 md:mt-2">
          <div className="w-full  md:p-3">
            <div className="w-full md:bg-white rounded-md p-3">
              {/* {console.log(compatibiltyTest)} */}
              <div
                onClick={() => {
                  compatibiltyTest?.completed
                    ? console.log("Clicked")
                    : user
                    ? router.push("/quiz-lobby/129")
                    : router.push("/login");
                }}
                className=" text-center bg-[#2aa8bf] flex justify-between min-h-32 items-center py-1 shadow-md max-md:rounded-md cursor-pointer px-3"
              >
                <div className="">
                  <h1 className="font-bold text-7xl text-center">C</h1>
                  <p className="text-center text-xs font-bold uppercase">
                    Compatibility
                  </p>
                </div>
                {!compatibiltyTest?.completed ? (
                  <div className="p-3 md:max-w-[500px] md:w-full md:rounded-md rounded-full border border-white text-[10px] md:h-12 md:flex justify-center items-center font-bold text-white md:text-lg uppercase bg-[#01be6a]">
                    <h5>TAKE THE COMPATIBILITY TEST</h5>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-3xl font-bold">
                      {compatibiltyTest?.compatibility}%
                    </p>
                    <p className="text-xs font-bold">
                      {compatibiltyTest?.rank}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full px-2  ">
            <div className="w-full p-3 min-h-20 rounded-md bg-white shadow-md border flex justify-center items-center text-center ">
              <p className="text-base md:text-lg font-bold text-[#32c8e3] md:tracking-wider">
                Take the tests & Earn Stars for each domain.
              </p>
            </div>
          </div>
          <div className="w-full grid-cols-12 gap-3  p-3 grid text-black">
            {/* {keywordsList?.length > 0 &&
              keywordsList.map((item) => {
                return (
                  <div
                    className="col-span-6 md:h-72 min-h-40 rounded-md shadow-lg relative "
                    key={item.id}
                  >
                    <div className="absolute top-0 left-0 w-full h-full rounded-md">
                      <Image
                        src={baseImgURL + item.image}
                        fill
                        objectFit="cover"
                        className="rounded-md opacity-70"
                      />
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full rounded-md  z-20 flex justify-center items-center">
                      <p className="text-2xl font-bold text-white text-center">
                        {item.name}
                      </p>
                    </div>
                  </div>
                );
              })} */}
            {activeThirdIndex && (
              <div className="col-span-12 ">
                <div
                  onClick={() => setActiveThirdIndex(null)}
                  className=" flex gap-3 items-center cursor-pointer w-fit"
                >
                  <FaAngleLeft size={24} color="black" />
                  <p className="font-bold">Back</p>
                </div>
              </div>
            )}
            {!activeThirdIndex && (
              <>
                <div
                  onClick={() => setActiveThirdIndex("aptitude")}
                  className=" col-span-6 md:col-span-12  rounded-md md:bg-white md:p-3 p-0"
                >
                  <div className="flex gap-2 justify-between items-center shadow-lg relative  cursor-pointer bg-[#f9cd60] w-full p-3 max-md:rounded-md">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-6xl font-bold text-center">A</h1>
                      <p className="font-bold text-center uppercase">
                        Aptitude
                      </p>
                    </div>
                    <div className="text-[9px] sm:text-xs text-left ">
                      <p>General</p>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setActiveThirdIndex("software")}
                  className=" col-span-6 md:col-span-12  rounded-md md:bg-white md:p-3 p-0"
                >
                  <div className="gap-2 flex justify-between items-center shadow-lg relative  cursor-pointer bg-[#fb7373] w-full p-3 max-md:rounded-md">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-6xl font-bold text-center">T</h1>
                      <p className="font-bold text-center uppercase">
                        Technical
                      </p>
                    </div>
                    <div className="text-[9px] sm:text-xs ">
                      <p>React Js</p>
                      <p>React Native</p>
                      <p>PHP</p>
                      <p>Html</p>
                      <p>Python</p>
                    </div>
                  </div>
                </div>
                {/* <Link
                  href={"/analytics"}
                  className="col-span-6 md:h-72 min-h-40 rounded-md shadow-lg relative "
                >
                  <div className="absolute top-0 left-0 w-full h-full rounded-md">
                    <Image
                      src={baseImgURL + "english.jpg"}
                      fill
                      objectFit="cover"
                      className="rounded-md opacity-100"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full rounded-md bg-purple-900/50  z-20 flex justify-center items-center">
                    <p className="text-2xl font-bold text-white text-center">
                      Language
                    </p>
                  </div>
                </Link> */}
                {/* <div
                  onClick={() => setActiveThirdIndex("culture")}
                  className="col-span-6 md:h-72 min-h-40 rounded-md shadow-lg relative cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-full h-full rounded-md">
                    <Image
                      src={baseImgURL + "culture.png"}
                      fill
                      objectFit="cover"
                      className="rounded-md opacity-100"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full rounded-md bg-gray-900/50  z-20 flex justify-center items-center">
                    <p className="text-2xl font-bold text-white text-center">
                      Culture
                    </p>
                  </div>
                </div> */}
              </>
            )}
          </div>
        </div>
        {activeThirdIndex &&
          quizData?.challenges_by_district &&
          Object.keys(quizData.challenges_by_district).length > 0 &&
          Object.keys(quizData.challenges_by_district).map(
            (districtName, index) => (
              <div className="bg-white w-full p-2 rounded-md" key={index}>
                <p className="font-bold mb-2">{districtName}</p>
                <div className="flex gap-2 w-full overflow-x-scroll">
                  {quizData.challenges_by_district[districtName] &&
                    quizData.challenges_by_district[districtName].length > 0 &&
                    quizData.challenges_by_district[districtName].map(
                      (item, itemIndex) => {
                        let formattedEndDate;
                        let formattedDate;
                        formattedDate = moment(item.start_date).fromNow();
                        const endDate = moment(item.end_date);
                        const now = moment();

                        const duration = moment.duration(endDate.diff(now));

                        if (duration.asDays() >= 1) {
                          formattedEndDate =
                            Math.round(duration.asDays()) + " days";
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

                        return (
                          <ChallengeHomeCard
                            key={itemIndex}
                            item={item}
                            formattedDate={formattedDate}
                            formattedEndDate={formattedEndDate}
                            inPage={true}
                            districtName={districtName}
                          />
                        );
                      }
                    )}
                </div>
              </div>
            )
          )}
        {/* {privateQuiz?.challenges_by_district &&
          Object.keys(privateQuiz.challenges_by_district).length > 0 &&
          Object.keys(privateQuiz.challenges_by_district).map(
            (districtName, index) => (
              <div className="bg-white w-full p-2 rounded-md" key={index}>
                <p className="font-bold mb-2">{districtName}</p>
                <div className="flex gap-2 w-full overflow-x-scroll">
                  {privateQuiz.challenges_by_district[districtName] &&
                    privateQuiz.challenges_by_district[districtName].length >
                      0 &&
                    privateQuiz.challenges_by_district[districtName].map(
                      (item, itemIndex) => {
                        let formattedEndDate;
                        let formattedDate;
                        formattedDate = moment(item.start_date).fromNow();
                        const endDate = moment(item.end_date);
                        const now = moment();

                        const duration = moment.duration(endDate.diff(now));

                        if (duration.asDays() >= 1) {
                          formattedEndDate =
                            Math.round(duration.asDays()) + " days";
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

                        return (
                          <ChallengeHomeCard
                            key={itemIndex}
                            item={item}
                            formattedDate={formattedDate}
                            formattedEndDate={formattedEndDate}
                            inPage={true}
                          />
                        );
                      }
                    )}
                </div>
              </div>
            )
          )} */}
      </div>
    );
  };
  const ProgressRoute = () => {
    return (
      <div className="w-full  h-full  p-1 space-y-4">
        {user ? (
          <div className="p-3">
            <div className=" flex gap-4 items-center mb-4">
              <p className="text-xl font-bold">My Progress</p>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <IoMdInformationCircleOutline color="red" size={23} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-72 max-w-96 p-3">
                    <p class="text-sm text-gray-600 font-bold">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Rerum reiciendis asperiores facilis voluptatum autem
                      deserunt itaque perferendis optio, esse cumque. Sit
                      nostrum architecto tenetur non placeat corrupti facere
                      dolorum assumenda?
                    </p>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="w-full space-y-6 pt-3">
              {/* {progressDetails &&
                progressDetails.length > 0 &&
                progressDetails.map((item, index) => {
                  return <ProgressCard item={item} key={index} />;
                })} */}
              {progressDetailspublic &&
                progressDetailspublic.length > 0 &&
                progressDetailspublic.map((item, index) => {
                  return <ProgressCard item={item} key={index} />;
                })}
            </div>
          </div>
        ) : (
          <div className="min-h-72 justify-center items-center w-full flex">
            <p className="font-bold">No data found</p>
          </div>
        )}
      </div>
    );
  };
  const renderContent = () => {
    switch (activeRouteIndex) {
      case "third":
        return <ThirdRoute />;
      case "fourth":
        return <ThirdRoute />;

      case "sixth":
        return <SixthRoute />;
      case "fifth":
        return <ProgressRoute />;
      case "second":
        return <TestRoute />;

      default:
        return <TestRoute />;
    }
  };
  const toggleFollow = async () => {
    if (user) {
      // Toggle the follow status optimistically
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);

      try {
        // Make the API request to follow/unfollow
        const response = await axios.get(
          `${baseURL}/event-Follow.php?page_id=${page_id}&userId=${user.id}`
        );

        // Handle the response data
        // console.log("Data:", response.data);
      } catch (error) {
        // Revert the follow status if an error occurs
        setIsFollowing((prevIsFollowing) => !prevIsFollowing);

        // Handle errors
        console.error("Error while following:", error);
        throw error; // Throw the error to handle it outside this function if needed
      }
    } else {
      router.push("/login");
    }
  };
  return (
    <div className="  md:min-h-screen min-h-[86vh] bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4] border w-full ">
      <MyCompany setIsLoading={setIsLoading} />
      <div className="w-full bg-white h-4" />
      <div className="w-full  bg-[white]" />
      <div className="    max-w-[1200px] w-full mx-auto ">
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
          <>
            <div>
              <div className="flex justify-between w-full  md:hidden p-3 bg-white border border-black/5 ">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      " relative  h-16 rounded-full w-16 border border-black/5 justify-center items-center "
                    )}
                  >
                    {selectedMovie?.image?.length > 0 && (
                      <Image
                        src={baseImgURL + selectedMovie?.image}
                        fill
                        alt="Profile Image"
                        className="rounded-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-4 py-3 font-bold ">
                    <p>{selectedMovie?.title}</p>
                  </div>
                </div>
                
                <div>
                  <div
                    className="flex justify-center min-w-24 items-center py-4"
                    onClick={toggleFollow}
                  >
                    <Button className="bg-blue-400 hover:bg-blue-400 py-0 px-10">
                      {isFollowing
                        ? "Following"
                        : // : totalPoints > 0
                          // ? "Follow Again"
                          "Follow"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className=" flex md:hidden justify-around w-full  p-3 bg-[#24975c] items-center mt-3">
                {routes.map((route, index) => {
                  return (
                    <div
                      onClick={() => {
                        setActiveRouteIndex(route.key);
                        setActiveThirdIndex(null);
                      }}
                      key={index}
                      className={cn(
                        " cursor-pointer   whitespace-nowrap",
                        activeRouteIndex === route.key
                          ? "font-bold uppercase text-[#fdbd5b]"
                          : "text-white"
                      )}
                    >
                      {route.title}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full h-full md:flex flex-1 gap-3 p-2 bg-gradient-to-r from-[#a3d9e3] to-[#d0f1c4]">
              <div className="hidden md:flex justify-center items-center w-56 mt-5 h-full">
                <div className="w-full bg-white h-full rounded-md min-h-[70vh]  flex flex-col  items-center">
                  <div
                    className={cn(
                      " relative  h-16 rounded-md w-16 border border-black/5 justify-center items-center mt-4"
                    )}
                  >
                    {selectedMovie?.image?.length > 0 && (
                      <Image
                        src={baseImgURL + selectedMovie?.image}
                        fill
                        alt="Profile Image"
                        className="rounded-full object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-4 py-3 font-bold ">
                    <p>{selectedMovie?.title}</p>
                  </div>
                  {compatibiltyTest?.completed &&  (
                  <div className="flex flex-col my-4 gap-2">
                    <p className="text-sm text-green-700 font-bold">
                    COMPATIBILITY - {compatibiltyTest?.compatibility}%
                    </p>
                    
                  </div>
                )}
                  <div className="  w-full items-center mt-3 rounded-md">
                    {routes.map((route, index) => {
                      return (
                        <div
                          onClick={() => {
                            setActiveRouteIndex(route.key);
                            setActiveThirdIndex(null);
                          }}
                          key={index}
                          className={cn(
                            " cursor-pointer mb-1 whitespace-nowrap hover:bg-[#5fdfa2] w-full p-2 flex justify-center items-center",
                            activeRouteIndex === route.key
                              ? "font-bold uppercase text-black bg-[#5fdfa2]"
                              : "text-black bg-[#ededed]"
                          )}
                        >
                          {route.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="overflow-y-scroll w-full">{renderContent()}</div>
            </div>
            <div className="mb-14" />
          </>
        )}
      </div>
    </div>
  );
};

export default PageDetails;
