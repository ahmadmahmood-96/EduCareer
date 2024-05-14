import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Assignment from "../Assignment/Upload";
import ModulePage from "../Module/AddModule";
import EnrolledStudent from "../ViewEnrolledStudent/EnrolledStudent";
import Topbar from "../../components/Navbar/NavbarPage";
import Schedule from "../Meeting/index";
import Quiz from "../Quiz";
import Meeting from "../Meeting/index";
import DisseminateQuiz from "../Quiz/DisseminateQuiz";
import { FaCheckCircle } from "react-icons/fa"; // Import the FaCheckCircle icon
import { message } from 'antd'; // Import message from antd

const Coursemainpage = () => {
  const location = useLocation();
  const title = location.state?.title || "Default Title";
  const [showAssignment, setShowAssignment] = useState(false);
  const [showModuleContent, setShowModuleContent] = useState(false);
  const [showEnrolledStudents, setShowEnrolledStudents] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDiss, setshowDiss] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // State for course completion status
  const [enrolledStudents, setEnrolledStudents] = useState([]); // State to store enrolled students
  const courseId = location.state?.courseId || "DefaultCourseId";
  const navigate = useNavigate();    
  useEffect(() => {
    const markCourseAsFinished = async () => {
      if (isCompleted) {
        message.success("You have successfully completed the course!");
        try {
        
          await axios.post(`http://localhost:8080/api/courses/${courseId}/finish`, { status: 'finished' });
          message.success("You have successfully completed the course!");
          // Optionally, you can update the UI to reflect that the course has been finished
        } catch (error) {
          console.error('Error finishing course:', error);
          // Handle error
        }
      }
    };
  
    markCourseAsFinished();
  }, [isCompleted, courseId]);
  

  const handleAddModuleClick = async () => {
    setShowAssignment(false);
    setShowModuleContent(true);
    setShowEnrolledStudents(false);
    setShowQuiz(false);
    setMeeting(false);
    setshowDiss(false);
  };

  const handleScheduleClick = () => {
    setShowAssignment(false);
    setShowModuleContent(false);
    setShowEnrolledStudents(false);
    setShowQuiz(false);
    setMeeting(true);
    setshowDiss(false);
  };

  const handleQuizClick = () => {
    setShowAssignment(false);
    setShowModuleContent(false);
    setShowEnrolledStudents(false);
    setMeeting(false);
    setShowQuiz(true);
    setshowDiss(false);
  };

  const handleShowMeeting = () => {
    setShowAssignment(false);
    setShowModuleContent(false);
    setShowEnrolledStudents(false);
    setMeeting(true);
    setShowQuiz(false);
    setshowDiss(false);
  };

  const handleDisseminate = () => {
    setShowAssignment(false);
    setShowModuleContent(false);
    setShowEnrolledStudents(false);
    setMeeting(false);
    setShowQuiz(false);
    setshowDiss(true);
  };

  const handleCompletion = () => {
    const isConfirmed = window.confirm("Are you sure you want to complete this course?");
    if (isConfirmed) {
      setIsCompleted(true); // Update completion status
      // Here you can add logic to mark the course as completed in your database or perform any other completion-related actions
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        minHeight: "100vh",
      }}
    >
      <Topbar />
      <div style={{ display: "flex" }}>
        <div style={{ width: "15%" }}>
          <Sidebar
            setShowAssignment={setShowAssignment}
            handleAddModuleClick={handleAddModuleClick}
            setShowModuleContent={setShowModuleContent}
            handleEnrolledStudentsClick={() => setShowEnrolledStudents(true)}
            setShowMeeting={handleShowMeeting}
            handleQuizClick={handleQuizClick}
            handleDisseminate={handleDisseminate}
            handleCompletion={handleCompletion} // Pass the handleCompletion function to the Sidebar
            courseTitle={title}
          />
        </div>
        <div style={{ width: "75%", padding: "20px", marginTop: "80px" }}>
          {showAssignment ? (
            <Assignment courseId={location.state?.courseId} />
          ) : showModuleContent ? (
            <ModulePage courseId={location.state?.courseId} />
          ) : showEnrolledStudents ? (
            <EnrolledStudent courseId={location.state?.courseId} enrolledStudents={enrolledStudents} />
          ) : meeting ? (
            <Meeting courseId={location.state?.courseId} />
          ) : showQuiz ? (
            <Quiz courseId={location.state?.courseId} />
          ) : showDiss ? (
            <DisseminateQuiz courseId={location.state?.courseId} />
          ) : (
            <EnrolledStudent courseId={location.state?.courseId} enrolledStudents={enrolledStudents} />
          )}

          {/* Render the completion icon if the course is completed
          {isCompleted && (
            <div className="mt-4">
             <FaCheckCircle size={30} color="green" />
             <p>Congratulations! You've completed this course.</p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Coursemainpage;
