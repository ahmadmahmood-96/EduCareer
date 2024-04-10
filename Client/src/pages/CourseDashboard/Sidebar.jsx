import React, { useState, createContext, useContext } from "react";

import {
  FaBook,
  FaClipboardList,
  FaUsers,
  FaRegCalendarCheck, // Changed from FaCalendarAlt
  FaQuestionCircle,
  FaShare,
} from "react-icons/fa"; // Import FaCalendarAlt for the schedule icon
import { MdAccountCircle } from "react-icons/md";
import { ChevronLast, ChevronFirst } from "lucide-react";

const SidebarContext = createContext();

const Sidebar = ({
  setShowAssignment,
  setShowMeeting,
  setShowModuleContent,
  handleEnrolledStudentsClick,
  handleQuizClick,
  handleDisseminate,
  courseTitle,
  children,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const handleAssignmentClick = () => {
    setShowAssignment((prevShowAssignment) => !prevShowAssignment);
    setShowModuleContent(false);
    handleEnrolledStudentsClick(false);
  };

  const handleModuleClick = () => {
    setShowModuleContent((prevShowModuleContent) => !prevShowModuleContent);
    setShowAssignment(false);
    handleEnrolledStudentsClick(false);
  };

  const handleEnrolledStudentsClickInternal = () => {
    handleEnrolledStudentsClick(
      (prevShowEnrolledStudents) => !prevShowEnrolledStudents
    );
    setShowAssignment(false);
    setShowModuleContent(false);
  };

  const handleMeetingClick = () => {
    setShowMeeting(true);
  };

  const handleQuiz = () => {
    handleQuizClick(true);
  };
  const handleDisseminateQuiz = () => {
    console.log("am Clicked");
    handleDisseminate(true);
  };

  return (
    <aside className={`h-screen  w-${expanded ? "25" : "10"}`}>
      <nav className="h-full fixed  flex flex-col rounded text-white  bg-Teal border-r shadow-sm">
        <div className="flex items-center w-full px-3 mt-3">
          <div
            className={` text-lg overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            EDUCAREER
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5  mr-0 text-white  rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700">
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3 items-center w-full h-12 px-3 mt-2 rounded hover:bg-white-700">
              {expanded && (
                <>
                  {courseTitle && (
                    <p className="mb-4 text-sm text-gray-300">
                      Course Title: {courseTitle}
                    </p>
                  )}
                  <button
                    onClick={handleModuleClick}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaBook className="mr-2" /> Content
                  </button>

                  <button
                    onClick={handleAssignmentClick}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaClipboardList className="mr-2" /> Assignment
                  </button>

                  <button
                    onClick={handleEnrolledStudentsClickInternal}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaUsers className="mr-2" /> Enrolled Students
                  </button>

                  <button
                    onClick={handleMeetingClick}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaRegCalendarCheck className="mr-2" /> Meeting
                  </button>

                  <button
                    onClick={handleQuiz}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaQuestionCircle className="mr-2" /> Quiz
                  </button>

                  <button
                    onClick={handleDisseminateQuiz}
                    className="mb-4 flex items-center text-white hover:bg-gray-700 rounded px-2"
                  >
                    <FaShare className="mr-2" /> Disseminate Quiz
                  </button>
                </>
              )}
              {children}
            </ul>
          </SidebarContext.Provider>
        </div>

        {userInfo && expanded && (
          <div className="border-t flex p-3 fixed bottom-0">
            <MdAccountCircle size={20} className="w-10 h-10 rounded-md" />
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}
              `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{userInfo.fullName}</h4>
                <span className="text-xs text-gray-600">{userInfo.email}</span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
