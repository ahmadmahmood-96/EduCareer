import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentQuizDetail = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledQuizzes = async () => {
      try {
        const userId = localStorage.getItem("token");

        axios
          .get(`http://localhost:8080/api/user/${userId}/quizzes`)
          .then((response) => {
            setQuizzes(response.data);
          });
      } catch (error) {
        console.error("Error fetching enrolled quizzes:", error);
      }
    };

    fetchEnrolledQuizzes();
  }, []);

  const isQuizAvailable = (startTime, startDate, endTime) => {
    const currentDateTime = new Date();
    const quizStartDateTime = new Date(`${startDate}T${startTime}`);
    const quizEndDateTime = new Date(`${startDate}T${endTime}`);
    return (
      quizStartDateTime <= currentDateTime && currentDateTime <= quizEndDateTime
    );
  };

  const handleStartClick = (quizId, courseId) => {
    // Check if the quiz has already been started by checking local storage
    const quizStarted = localStorage.getItem(`quiz_${quizId}_started`);
    if (quizStarted) {
      alert("You already have attempted the quiz once.");
    } else {
      console.log(`Start quiz with ID: ${quizId} for course: ${courseId}`);
      // Set flag in local storage indicating the quiz has been started
      localStorage.setItem(`quiz_${quizId}_started`, true);
      // Navigate to the quiz page with both quizId and courseId
      navigate(`/quiz/${courseId}/${quizId}`);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Quizzes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Quiz Title</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">Start Time</th>
              <th className="py-2 px-4 border-b">End Time</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td className="py-2 px-4 border-b">{quiz.title}</td>
                <td className="py-2 px-4 border-b">{quiz.date}</td>
                <td className="py-2 px-4 border-b">{quiz.startTime}</td>
                <td className="py-2 px-4 border-b">{quiz.endTime}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleStartClick(quiz.quizId, quiz.courseId)}
                    disabled={
                      !isQuizAvailable(quiz.startTime, quiz.date, quiz.endTime)
                    }
                  >
                    Start
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentQuizDetail;
