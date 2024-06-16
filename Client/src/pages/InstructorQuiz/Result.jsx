import React from "react";
import { useNavigate } from "react-router-dom";

function QuizResult(props) {
  const { score, totalScore } = props;
  const navigate = useNavigate();
  // Calculate the percentage score
  const percentageScore = (score / totalScore) * 100;

  // Determine a message based on the percentage score
  let message = "";
  if (percentageScore >= 80) {
    message = "Congratulations! You did great!";
  } else if (percentageScore >= 60) {
    message = "Well done! You passed.";
  } else {
    message = "Sorry! you are not eligible to teach on EduCareer";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="show-score text-4xl font-bold text-center">
        Your Score: {score}
        <br />
        Total Score: {totalScore}
      </div>
      <div className="text-lg text-center my-4">
        <p>{message}</p>
        <p>Percentage Score: {percentageScore.toFixed(2)}%</p>
      </div>

      {/* {showLoginButton && (
        <button
          onClick={() => navigate("/instructor-dashhboard")}
          className="bg-teal-600 text-white px-6 py-3 rounded-md shadow-md font-bold text-lg transition duration-200 hover:bg-teal-700 ml-4"
        >
          Go to Login
        </button>
      )}
      {showHomeButton && (
        <button
          onClick={() => navigate("/home")}
          className="bg-teal-600 text-white px-6 py-3 rounded-md shadow-md font-bold text-lg transition duration-200 hover:bg-teal-700 ml-4"
        >
          Go to Home
        </button>
      )} */}
    </div>
  );
}

export default QuizResult;
