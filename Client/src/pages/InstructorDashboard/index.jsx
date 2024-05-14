import React, { useState } from "react";
import Topbar from '../../components/Navbar/NavbarPage';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from 'react-icons/fa';
import CourseDisplay from '../Course/CourseDisplay';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileAddOutlined } from "@ant-design/icons"; 
import { Tooltip, Radio } from "antd";

function InstructorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    criteria: "",
    duration: "",
    category: "",
    preRequisite: "",
    instructor: "",
    categorypaid: "Free",
    price: "",
    capacity: "",
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  
  const [file, setFile] = useState(null);
  const [showPriceField, setShowPriceField] = useState(false);
  const container = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  const handleChange = (e) => {
    if (e && e.target) {
      if (e.target.name === "file") {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log(
          "Selected File Name:",
          selectedFile ? selectedFile.name : null
        );
      } else {
        setCourse({
          ...course,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
  
    // Check if an image is selected
    if (!file) {
      toast.error('Select File Please');
      return;
    }
    if (!isNaN(course.preRequisite)) {
      toast.error('Pre-Requisite should not be a number');
      return;
    }
  
    // Check if Completion Criteria field is not a number
    if (isNaN(course.criteria)) {
      toast.error('Completion Criteria should be a number');
      return;
    }
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Authentication token not found");
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Append fields to FormData
      Object.entries(course).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      // Append file to FormData
      formData.append("file", file);
      formData.append("userId", token);
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };
  
      const response = await axios.post(
        `http://localhost:8080/api/createcourses`,
        formData,
        { headers }
      );
  
      setSuccessMessage("Course information submitted successfully!");
      toggleModal();
      window.location.reload();
    } catch (error) {
      console.log("Error submitting course information:", error);
  
      if (error.response && error.response.status === 401) {
        console.error("Authentication failed");
      } else {
        console.error("Failed to submit course information:", error.message);
      }
    }
  };
  
  const handleCancel = () => {
    toggleModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Topbar />
      <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
        <div style={{ marginBottom: '16px' }}> 
          <button onClick={toggleModal}>
            <FaPlus /> Add Course
          </button>
        </div>
        <CourseDisplay />
      </div>

      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
          <div className="overflow-y-auto max-h-[80vh] relative p-4 w-full max-w-md max-h-full">
          <div
            id="crud-modal"
            tabIndex="-1"
            aria-hidden="true"
            className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen w-full`}
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Create New Course
                  </h3>
                  <button type="button" onClick={toggleModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                  <div className="mb-4 flex items-center">
                    <input
                      type="text"
                      id="title"
                      name="title"
                      onChange={handleChange}
                      className="mt-1 p-2 w-3/4 border rounded"
                      placeholder="Course Title"
                      required
                    />
                    <label htmlFor="file" className="ml-4">
                      <Tooltip title="Click to add file">
                        <FileAddOutlined style={{ fontSize: '34px', cursor: 'pointer' }} />
                        <input
                          type="file"
                          id="file"
                          name="file"
                          onChange={handleChange}
                          className="hidden"
                          accept="image/*"
                          required
                        />
                      </Tooltip>
                    </label>
                  </div>

                  <div className="mb-4">
                    <textarea
                      id="description"
                      name="description"
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border "
                      placeholder="Course Description"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="mb-4 flex justify-between">
                    <div className="w-1/2 mr-2">
                      <input
                        type="text"
                        id="preRequisite"
                        name="preRequisite"
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border"
                        placeholder="Pre-Requisite (optional)"
                      />
                    </div>
                    <div className="w-1/2 ml-2">
                      <input
                        type="text"
                        id="criteria"
                        name="criteria"
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border"
                        placeholder="Completion Criteria"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4 flex justify-between">
                    {/* <div className="w-1/2 mr-2">
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border"
                        placeholder="Course Duration"
                        required
                      />
                    </div> */}
                  
                  
    <select
      id="category"
      name="category"
      onChange={handleChange}
      className="mt-1 p-2 w-full border"
      required
    >
      <option value="" disabled selected>
        Category
      </option>
      <option value="Machine Learning">Machine Learning</option>
      <option value="Programming and Development">
        Programming and Development
      </option>
      <option value="Database Management">Database Management</option>
      <option value="Networking ">Networking</option>
      <option value="Programming Languages">Programming Languages</option>
      <option value="Operating Systems">Operating System</option>
      <option value="Software Engineering">Software Engineering</option>
    </select>
 
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="categorypaid"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category (Paid/Free)
                    </label>
                    <Radio.Group
                      id="categorypaid"
                      name="categorypaid"
                      onChange={handleChange}
                      className="mt-1 p-2 w-full  "
                      required
                    >
                      <Radio value="Free">Free</Radio>
                      <Radio value="Paid">Paid</Radio>
                    </Radio.Group>
                  </div>

                  {course.categorypaid === "Paid" && (
  <div className="mb-4">
    <label
      htmlFor="price"
      className="block text-sm font-medium text-gray-700"
    >
      Price
    </label>
    <input
      type="text"
      id="price"
      name="price"
      value={course.price} 
      onChange={handleChange}
      className="mt-1 p-2 w-full border"
      placeholder="Enter the course price"
      required
    />
  </div>
)}


                  <div className="flex items-center justify-between">
                    <button
                      className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className="bg-red-500 text-white mt-2 px-4 py-2  hover:bg-red-600 focus:outline-none"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
          
        </>
      )}

      <motion.div variants={container} initial="hidden" whileInView="visible" className="grid md:grid-cols-4 sm:grid-cols-2 mt-12 gap-8"></motion.div>
      <ToastContainer /> {/* Toast Container for displaying notifications */}
    </div>
  );
}

export default InstructorDashboard;
