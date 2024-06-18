"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseImgURL, baseURL } from "@/lib/baseData";
import { Loader2 } from "lucide-react";
import DescriptionText from "./DescriptionText";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Quiz = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionLength, setCurrentQuestionLength] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [startIndex, setStartIndex] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionColors, setOptionColors] = useState([]);

  const colors = [
    { id: 1, from: "#ff0061", to: "#fec194" },
    { id: 2, from: "#00ffa9", to: "#0d4dff" },
    { id: 3, from: "#1fc9fd", to: "#fc00f1" },
    { id: 4, from: "#a32cdf", to: "#105ad2" },
    { id: 5, from: "#ffe35b", to: "#ff2525" },
  ];

  const userProgress = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/get-user-quiz.php?userId=${userId}`
      );
      const data = response.data;
      console.log(data);
      if (data.challenges.completed === "true") {
        setFeedback(data.challenges);
        setCompleted(true);
      } else {
        const questionsArray = Object.values(data.challenges).filter(
          (item) => typeof item === "object"
        );
        setQuestions(questionsArray);
        initializeOptionColors(questionsArray);
      }
      if (data?.challenges[0]?.count_question) {
        setCurrentQuestionLength(data?.challenges[0]?.count_question);
      }
    } catch (error) {
      console.error("Error while fetching quiz");
    }
  };
  useEffect(() => {
    userProgress();
  }, [userId]);

  const initializeOptionColors = (questionsArray) => {
    const initialColors = questionsArray.map(() => getRandomColor());
    setOptionColors(initialColors);
  };

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // console.log(currentQuestionIndex)
  // console.log(currentQuestionLength)
  const handleNextClick = async () => {
    if (!selectedOption) return;
    if (currentQuestionLength <= 0) return;
    setOptionColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[currentQuestionIndex] = getRandomColor();
      return updatedColors;
    });
    if (currentQuestionIndex < currentQuestionLength - 1) {
      await submitMarks(selectedOption, "no");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for the next question
    } else if (currentQuestionIndex === currentQuestionLength - 1) {
      await submitMarks(selectedOption, "yes");
    }
  };

  const submitMarks = async (answer, finalValue) => {
    try {
      console.log(finalValue);

      const formData = new URLSearchParams();
      formData.append("user_id", userId);
      formData.append("finalValue", finalValue);
      formData.append("option_id", answer.option_id);
      formData.append("question_id", answer.question_id);
      formData.append("analytic_id", answer.analytic_id);
      const response = await axios.post(
        `${baseURL}/add-user-progress.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        if (finalValue === "yes") {
          setCompleted(true);
          userProgress();
        }
      }
    } catch (error) {
      console.error("Error adding marks:", error);
    }
  };

  if (completed) {
    return (
      <div className="w-full flex justify-center flex-col space-y-4 items-center mb-6">
        <h1 className="text-3xl font-bold">Personality Type</h1>
        {feedback ? (
          <div className=" shadow-lg bg-[#d1cef2]  rounded-lg flex flex-col justify-center items-center gap-4 p-6 w-full border">
            <h1 className="text-2xl font-bold">{feedback?.name}</h1>
            <div className="relative h-52 w-40">
              <Image src={baseImgURL + feedback?.image} fill objectFit="cover" />
            </div>
            <p className="text-sm font-light">
              {feedback?.type}
              {" ("}
              {feedback?.type2}
              {")"}
            </p>

            <div className="flex flex-col  gap-3">
              <p className=" font-semibold">Strengths</p>
              <div className=" text-sm font-light flex-wrap flex  w-full ">
                {feedback?.strengths?.map((strength, index) => (
                  <p key={index} className="">
                    {strength}
                    {index !== feedback?.strengths.length - 1 && ","}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col  gap-3">
              <p className=" font-semibold">Weaknesses</p>
              <div className=" text-sm font-light flex-wrap flex  w-full ">
                {feedback?.weaknesses?.map((weakness, index) => (
                  <p key={index} className="">
                    {weakness}
                    {index !== feedback?.weaknesses.length - 1 && ","}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col  gap-3">
              <p className=" font-semibold">Opportunities</p>
              <div className=" text-sm font-light flex-wrap flex  w-full ">
                {feedback?.opportunities?.map((opprtunity, index) => (
                  <p key={index} className="">
                    {opprtunity}
                    {index !== feedback?.opportunities.length - 1 && ","}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col  gap-3">
              <p className=" font-semibold">Threats</p>
              <div className=" text-sm font-light flex-wrap flex  w-full ">
                {feedback?.threats?.map((threat, index) => (
                  <p key={index} className="">
                    {threat}
                    {index !== feedback?.threats.length - 1 && ","}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center font-bold">
            Sorry, No data found.
          </div>
        )}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentColor = optionColors[currentQuestionIndex];

  return (
    <div className="bg-white w-full mb-12">
      {startIndex ? (
        <div className="">
          <div className="min-h-96 justify-center items-center flex bg-[#d1cef2] shadow-lg rounded-3xl p-6 border w-full">
            {!completed && (
              <div className="w-full justify-between h-full flex flex-col gap-5">
                <h1 className="text-2xl font-bold text-black mb-4 text-center">
                  Question {currentQuestion?.question_id}
                </h1>
                <h2 className="text-xl mb-4 text-black text-center">
                  {currentQuestion.question_text}
                </h2>
                <div className="grid grid-cols-12 gap-5 w-full items-center justify-between">
                  {currentQuestion?.options?.length > 0 &&
                    currentQuestion.options.map((option) => (
                      <button
                        key={option.analytic_id}
                        style={{
                          background: `linear-gradient(to bottom left, ${currentColor.from}, ${currentColor.to})`,
                        }}
                        className={`font-semibold py-2 px-4 rounded w-full col-span-12 shadow transition duration-300 ${
                          selectedOption === option
                            ? "text-white opacity-65"
                            : "text-white hover:text-white"
                        }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        {option.option_text}
                      </button>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleNextClick}
                    disabled={!selectedOption}
                    className="bg-gradient-to-t from-[#00b050] to-[#00b050] flex justify-center items-center text-white text-lg rounded-lg font-bold"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center min-h-[50vh]">
          <Button
            onClick={() => setStartIndex(true)}
            className="w-full max-w-60 bg-gradient-to-t from-[#1E8449] to-[#52BE80] min-h-20 flex justify-center items-center text-white text-lg rounded-lg font-bold"
          >
            Take your personality test
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
