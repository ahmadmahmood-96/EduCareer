import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function StudentQuiz() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // State to track selected option
  const [hoveredOption, setHoveredOption] = useState(null); // State to track hovered option
  const [timeRemaining, setTimeRemaining] = useState(120); // Default time remaining (2 minutes)
  const { quizId } = useParams();
  const { courseId } = useParams();
  let timerInterval;

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/${quizId}/questions`
        );
        setQuizQuestions(response.data);
        console.log(response.data);
        setShuffledQuestions(shuffleQuestions(response.data));

        // Calculate time remaining based on the number of questions
        const numQuestions = response.data.length;
        setTimeRemaining(numQuestions <= 5 ? 120 : 300); // If less than or equal to 5 questions, set 2 minutes, else set 5 minutes
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuizQuestions();
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining === 0) {
      setQuizCompleted(true);
      setShowResult(true);
    } else if (quizCompleted) {
      clearInterval(timerInterval);
    }
  }, [timeRemaining, quizCompleted]);

  useEffect(() => {
    timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const shuffleQuestions = (questions) => {
    const shuffledQuestions = shuffleArray([...questions]);
    return shuffledQuestions.map((question) => {
      const shuffledQuestion = { ...question };
      shuffledQuestion.options = shuffleArray([
        question.correctAnswer,
        ...question.wrongOptions,
      ]);
      return shuffledQuestion;
    });
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleOptionSelect = (option) => {
    if (!quizCompleted) {
      if (option === shuffledQuestions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
      setSelectedOption(option); // Save selected option
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option when moving to next question
    } else {
      setQuizCompleted(true);
      setShowResult(true);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const userId = localStorage.getItem("token");
      console.log("Quiz completed! Total score:", score);
      setShowResult(true);
      console.log("fetcheddd courseIddddddd", userId);
      console.log("fetcheddd courseIddddddd", courseId);
      console.log("fetcheddd score", score);
      console.log("fetcheddd length total", shuffledQuestions.length);
      // Send quiz score data to backend

      await axios.post("http://localhost:8080/api/scores", {
        userId,
        courseId, // Replace with actual course ID
        quizId: quizId,
        score: score,
        totalMarks: shuffledQuestions.length,
      });
      console.log("Quiz completed! Total score:", score);
      setShowResult(true);
    } catch (error) {
      console.error("Error storing quiz score:", error);
    }
  };

  const calculatePercentage = () => {
    const totalQuestions = shuffledQuestions.length;
    const percentage = (score / totalQuestions) * 100;
    return percentage.toFixed(2);
  };

  const provideFeedback = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    if (percentage < 40) {
      return "Oops, You Need to Work Hard.";
    } else if (percentage < 75) {
      return "A bit Closer to your Goal, but work hard.";
    } else {
      return "Good, keep it up.";
    }
  };

  return (
    <div className="container">
      <p className="heading-txt text-white text-3xl font-bold mb-5 text-center uppercase">
        Quiz
      </p>
      {showResult ? (
        <div className="container ml-20 flex justify-center items-center flex-col min-h-400 w-400 bg-white rounded-lg shadow overflow-hidden ">
          <p className="text-3xl font-bold mt-4">Your Score: {score}</p>
          <p className="text-3xl font-bold mt-4">
            Total Score: {shuffledQuestions.length}
          </p>
          <p>Percentage: {calculatePercentage()}%</p>
          <p>{provideFeedback()}</p>
        </div>
      ) : (
        <div className="container mt-2  ml-20 flex justify-center items-center flex-col min-h-400 w-400 bg-white rounded-lg shadow overflow-hidden relative">
          <div className="timer absolute top-0 right-0 p-4 text-lg font-bold text-purple-600">
            Time Remaining:{" "}
            {Math.floor(timeRemaining / 60)
              .toString()
              .padStart(2, "0")}
            :{(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
          <div className="question bg-white shadow-md rounded-lg px-5 py-3 font-bold font-serif text-lg min-w-full min-h-90 flex justify-center items-center m-8">
            <span id="question-number" className="mr-5">
              {currentQuestionIndex + 1}.{" "}
            </span>
            <span id="question-txt">
              {shuffledQuestions[currentQuestionIndex]?.questionText}
            </span>
          </div>
          <div className="option-container flex flex-col m-4 p-10 w-full">
            {shuffledQuestions[currentQuestionIndex]?.options?.map(
              (option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`option-btn shadow-md px-5 py-2 rounded-md border-none outline-none transition duration-300 m-5 min-h-30 ${
                    hoveredOption === option || selectedOption === option
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setHoveredOption(option)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  {option}
                </button>
              )
            )}
          </div>
          {quizCompleted ||
          currentQuestionIndex === shuffledQuestions.length - 1 ? (
            <button
              type="button"
              className="bg-purple-600 text-white px-10 py-4 rounded-md shadow-md transition duration-200 font-bold text-lg"
              onClick={handleSubmitQuiz}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="bg-purple-600 text-white px-10 py-4 rounded-md shadow-md transition duration-200 font-bold text-lg"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentQuiz;
