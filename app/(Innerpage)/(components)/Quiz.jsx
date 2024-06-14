"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/lib/baseData";
import { Loader2 } from "lucide-react";
import DescriptionText from "./DescriptionText";

const Quiz = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const userProgress = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/get-user-quiz.php?userId=${userId}`
        );
        const data = response.data;
        console.log(data);
        if (data.challenges.completed === "true") {
          setFeedback(data.challenges.feedback);
          setCompleted(true);
        } else {
          const questionsArray = Object.values(data.challenges).filter(
            (item) => typeof item === "object"
          );
          setQuestions(questionsArray);
        }
      } catch (error) {
        console.error("Error while fetching quiz");
      }
    };
    userProgress();
  }, [userId]);

  const handleAnswerClick = async (answer) => {
    // console.log(currentQuestionIndex);
    // console.log(questions.length-1);
  
    if (currentQuestionIndex < questions.length - 1) {
      await submitMarks(answer, "no");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1) {
      await submitMarks(answer, "yes");
    }
  };
  

  const submitMarks = async (answer, finalValue) => {
    try {
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
      if(response.data.success){
        if(finalValue=="yes")
            {
                setCompleted(true);
                userProgress()
            }
      }
    } catch (error) {
      console.error("Error adding marks:", error);
    }
  };

  if (completed) {
    return (
      <div className="">
        <div className="bg-white shadow-lg rounded-lg p-6 font-bold">
            {
                feedback && (          <DescriptionText rules={feedback} />
                )
            }
        </div>
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

  return (
    <div className=" bg-white w-full">
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Personality Assessment</h1>
        <div className="text-base mb-4">
          This assessment is designed to evaluate your personality traits.
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 border w-full">
          <div className="w-full">
            <h2 className="text-xl mb-4">{currentQuestion.question_text}</h2>
            <div className="flex flex-col space-y-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.analytic_id}
                  className="bg-blue-100 text-black py-2 px-4 rounded w-fit shadow hover:bg-blue-700 hover:text-white transition duration-300"
                  onClick={() => handleAnswerClick(option)}
                >
                  {option.option_text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
