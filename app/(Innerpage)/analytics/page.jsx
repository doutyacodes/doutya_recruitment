"use client";
import { Button } from "@/components/ui/button";
import { baseURL } from "@/lib/baseData";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import axios from "axios";
import moment from "moment";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChallengeHomeCard from "../(components)/ChallengeHomeCard";
import Quiz from "../(components)/Quiz";

const AnalyticsPage = () => {
  const [toggleNav, setToggleNav] = useState("Analysis");
  const [isLoading, setIsLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [userData, setUserData] = useState(null);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user && !user?.id) {
      return redirect("/signup");
    } else {
      fetchData();
    }
  }, [user]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const fetchLanguage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/get-languages.php`);

      if (response.data.success) {
        setLanguages(response.data.data);
      }
    } catch (error) {
      console.log("error fetching languages", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/get-user-count.php?id=${user?.id}`
      );

      console.log(response.data);

      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log("error fetching user", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchPrivateQuiz = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/getEachTestQuizLanguage.php?userId=${
          user?.id ? user.id : null
        }`
      );
      //   console.log(response.data);
      if (response.data) {
        setQuizData(response.data);
      }
    } catch (error) {
      console.error("Error while fetching quiz");
    }
  };
  useEffect(() => {
    fetchLanguage();
  }, []);
  useEffect(() => {
    fetchPrivateQuiz();
  }, []);

  const toggleLanguage = (language) => {
    setSelectedLanguages((prevSelected) =>
      prevSelected.some((lang) => lang.id === language.id)
        ? prevSelected.filter((lang) => lang.id !== language.id)
        : [...prevSelected, language]
    );
  };
  const handleSubmit = async () => {
    if (user) {
      if (selectedLanguages.length > 0) {
        try {
          setIsLoading(true);
          const payload = {
            user_id: user.id,
            languages_selected: selectedLanguages,
          };
          const response = await axios.post(
            `${baseURL}/add-user-languages.php`,
            payload,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
          if (response.data.success) {
            fetchData();
          }
        } catch (error) {
          console.error("Submission error:", error);
          alert("An error occurred while submitting language.");
        } finally {
          setIsLoading(false);
        }
      } else {
        alert("You must select at least one language to continue.");
      }
    }
  };
  const visitForm = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("user_id", user ? user.id : null);
      formData.append("page_name", "analytics");

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
  const RenderData = () => {
    switch (toggleNav) {
      case "Analysis":
        return <AnalyticsRoute />;
      case "Language":
        return <LanguageRoute />;
      default:
        return <AnalyticsRoute />;
    }
  };
  // console.log(selectedLanguages)
  const AnalyticsRoute = () => {
    return (
      <div className="flex h-full min-h-screen flex-col gap-2 bg-white px-3 py-4">
        <Quiz userId={user.id} />
      </div>
    );
  };

  const LanguageRoute = () => {
    return (
      <div className=" h-full min-h-screen space-y-5 bg-white px-3 py-4">
        {userData && userData.count == 0 ? (
          <>
            <h1 className="text-lg font-semibold">
              Select the languages you know.
            </h1>
            <div className="flex flex-wrap -m-2">
              {languages?.length > 0 &&
                languages.map((language) => (
                  <button
                    key={language.id}
                    onClick={() => toggleLanguage(language)}
                    className={`m-2 px-4 py-2 border rounded-lg text-lg 
                  ${
                    selectedLanguages.some((lang) => lang.id === language.id)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  >
                    {language.language}
                  </button>
                ))}
            </div>
            <div className="w-full p-3 flex justify-center items-center">
              {languages?.length > 0 && (
                <Button
                  className="bg-red-500 text-base hover:bg-red-500 disabled:bg-red-800"
                  disabled={isLoading || selectedLanguages.length === 0}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {quizData?.challenges_by_district &&
              Object.keys(quizData.challenges_by_district).length > 0 &&
              Object.keys(quizData.challenges_by_district).map(
                (districtName, index) => (
                  <div className="bg-white w-full p-2" key={index}>
                    <p className="font-bold mb-2">{districtName}</p>
                    <div className="flex gap-2 w-full overflow-x-scroll">
                      {quizData.challenges_by_district[districtName] &&
                        quizData.challenges_by_district[districtName].length >
                          0 &&
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
                              formattedEndDate =
                                duration.minutes() + " minutes";
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
              )}
          </>
        )}
      </div>
    );
  };

  const handleToggle = (value) => {
    setToggleNav(value);
  };

  return (
    <div className="w-full min-h-screen p-3">
      <div className="flex justify-between items-center shadow border-b">
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Analysis" && "border-b border-black"
          )}
          onClick={() => handleToggle("Analysis")}
        >
          Analysis
        </p>
        <p
          className={cn(
            "flex-1 text-center py-3 bg-white font-bold duration-200 ease-in-out transition-all ",
            toggleNav == "Language" && "border-b border-black"
          )}
          onClick={() => handleToggle("Language")}
        >
          Language
        </p>
      </div>
      {RenderData()}
    </div>
  );
};

export default AnalyticsPage;
