import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Form, Input, Button, DatePicker, Upload, message } from "antd";

const Certificate = () => {
  const userId = localStorage.getItem("token");
  const [finishedCourses, setFinishedCourses] = useState([]); // State to store finished courses
  const [studentName, setStudentName] = useState(""); // State to store student name
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [courseName, setCourseName] = useState(""); // State to store course name

  useEffect(() => {
    // Function to fetch finished courses for a specific student
    const fetchFinishedCourses = async () => {
      try {
        // Fetch finished courses for the specific student
        const response = await axios.get(`http://localhost:8080/api/enrollments/student/${userId}/finished-courses`);
        // Update state with the finished courses data
        setFinishedCourses(response.data.finishedCourses);
        // Access the student name and course name from the first element of the array
        if (response.data.finishedCourses.length > 0) {
          setStudentName(response.data.finishedCourses[0].studentName);
          setCourseName(response.data.finishedCourses[0].courseName);
        }
      } catch (error) {
        console.error('Error fetching finished courses:', error);
        // Handle error
      }
    };
  
    // Call the fetchFinishedCourses function
    if (userId) {
      fetchFinishedCourses();
    }
  }, [userId]);

  useEffect(() => {
    // Function to fetch finished courses for a specific student
    const fetchFinishedCourses = async () => {
      try {
        // Fetch finished courses for the specific student
        const response = await axios.get(`http://localhost:8080/api/enrollments/student/${userId}/finished-courses`);
        // Update state with the finished courses data
        setFinishedCourses(response.data.finishedCourses);
        // Access the student name from the first element of the array
        if (response.data.finishedCourses.length > 0) {
          setStudentName(response.data.finishedCourses[0].studentName);
        }
      } catch (error) {
        console.error('Error fetching finished courses:', error);
        // Handle error
      }
    };
  
    // Call the fetchFinishedCourses function
    if (userId) {
      fetchFinishedCourses();
    }
  }, [userId]);
  useEffect(() => {
    // Check course completion when finishedCourses state changes
    checkCourseCompletion();
  }, [finishedCourses]);

  const checkCourseCompletion = async () => {
    try {
      // Assuming finishedCourses contains only one course for simplicity
      const courseId = finishedCourses.length > 0 ? finishedCourses[0].courseId : null;
      if (!courseId) return;

      // Fetch average marks for assignments and quizzes
      const avgAssignmentMarksResponse = await axios.get(`http://localhost:8080/api/calculate-average-assignment-marks/${userId}/${courseId}`);
      const avgAssignmentMarks = avgAssignmentMarksResponse.data.avgAssignmentMarks;
      const avgQuizMarksResponse = await axios.get(`http://localhost:8080/api/calculate-average-quiz-marks/${userId}/${courseId}`);
      const avgQuizMarks = avgQuizMarksResponse.data.avgQuizMarks;

      // Fetch course completion criteria
      const completionCriteriaResponse = await axios.get(`http://localhost:8080/api/courses/${courseId}/completion-criteria`);
      const completionCriteria = completionCriteriaResponse.data.completionCriteria; // Assuming completion criteria is in percentage
      
      // Calculate combined average marks
      const combinedAvgMarks = (avgAssignmentMarks + avgQuizMarks) / 2;

      // Check if combined average marks meet the completion criteria
      if (combinedAvgMarks >= completionCriteria) {
        console.log(`Student ${studentName} has completed the course and meets the completion criteria.`);
        setCertificateIssued(true);
      } else {
        console.log(`Student ${studentName} has completed the course but does not meet the completion criteria.`);
        setCertificateIssued(false);
      }
    } catch (error) {
      console.error('Error checking course completion:', error);
      // Handle error
    }
  };
  

  useEffect(() => {
    // Draw image on canvas when finishedCourses state changes
    drawCertificate();
  }, [finishedCourses, studentName]);

  const drawCertificate = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = '/certificate.jpg'; // Path to your image in the public folder

    image.onload = function () {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      ctx.font = '40px monotype corsiva';
      ctx.fillStyle = '#000';
      ctx.fillText(studentName, 198, 210); // Draw student name
    };
  };

  const handleDownload = () => {
    const canvas = document.getElementById('canvas');
    const url = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Certificate.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    
    <div>
      <Typography.Title level={2}>Earn Certificate</Typography.Title>
      <p>Congratulations, {studentName}! You have successfully completed the course "{courseName}".</p>
     
      <canvas className=" "id="canvas" height="400" width="600"></canvas>
      <a className="text-teal-900 mt-10 dark:text-white pl-5 cursor-pointer" onClick={handleDownload}>Click to Download Certificate</a>
    </div>
  );
};

export default Certificate;
