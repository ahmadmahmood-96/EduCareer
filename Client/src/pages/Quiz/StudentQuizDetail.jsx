import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Table, Tooltip, Typography, message, Tag, Upload, Form, Button } from "antd";
import {UploadOutlined, FileOutlined } from "@ant-design/icons";
import { FileInput } from "lucide-react";

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

  const columns = [
    {
      key: 1,
      title: "Quiz Title",
      // dataIndex: "firstName",
      dataIndex: "title",
      width:250,
    },
    {
      key: 2,
      title: "Due Date",
      dataIndex: "date",
      width:250,
    },
    {
      key: 3,
      title: "Start Time",
      dataIndex: "startTime",
      width:250,
    },

    {
      key: 4,
      title: "End Time",
      dataIndex: "endTime",
      width:250,
    },

    {
      key: 5,
      title: "Actions",
      width:250,
      render: (_, quiz) => (
      
         <Button
       
         onClick={() => handleStartClick(quiz.quizId, quiz.courseId)}
         disabled={
           !isQuizAvailable(quiz.startTime, quiz.date, quiz.endTime)
         }
       >
         Start
       </Button>
      ),
    },
    

  ];

  return (
    <div className="mt-4">
      <Typography.Title level={2}>Quizzes</Typography.Title>
      <Table columns={columns} dataSource={quizzes} />
    </div>
  );
};

export default StudentQuizDetail;
