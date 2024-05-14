import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import CourseCard from '../../customcomponents/Card';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip, Radio } from "antd";
import { FileAddOutlined } from "@ant-design/icons"; 

const CourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/displaycourses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => setCourses(result.data))
      .catch((err) => console.log(err));
  }, [token]);

  const handleDelete = (id) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this course?');

    if (confirmDeletion) {
      axios
        .delete(`http://localhost:8080/api/deletecourses/${id}`)
        .then(() => {
          setCourses(courses.filter((course) => course._id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

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
  
 
  const handleUpdate = (id) => {
    setIsModalOpen(true);
    axios
    .get(`http://localhost:8080/api/updatecourses/${id}`)
    .then((result) => {
      console.log("Fetched Data:", result.data);
      setCourses((prevState) => ({
        ...prevState,
        id:result.data._id,
        title: result.data.title,
        description: result.data.description,
        criteria: result.data.criteria,
        instructor: result.data.instructor,
        duration: result.data.duration,
        category: result.data.category,
        preRequisite: result.data.preRequisite,
        categorypaid: result.data.categorypaid,
        price: result.data.price,
        capacity: result.data.capacity,
        file: result.data.file,
      }));
    })
    .catch((err) => console.error("Error fetching course data:", err));
    
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCourseClick = (courseId, title) => {
    navigate(`/CourseDashboard`, { state: { title, courseId } });
  };

  const handleHover = (course) => {
    console.log(`Hovering over course: ${course.title}`);
  };

  const handleSubmit = (e) => {
    const id=courses.id;
    e.preventDefault();
    if (!isNaN(courses.preRequisite)) {
      toast.error('Pre-Requisite should not be a number');
      return;
    }
  
    // Check if Completion Criteria field is not a number
    if (isNaN(courses.criteria)) {
      toast.error('Completion Criteria should be a number');
      return;
    }
    const updatedCourses = { ...courses };
    if (updatedCourses.categorypaid === "Free") {
      updatedCourses.price = "";
    }
    axios
      .put(`http://localhost:8080/api/updatecourses/${id}`, updatedCourses)
      .then((result) => {
        console.log("Course Information Submitted:", result.data);
      
      toggleModal();
      window.location.reload();

      toast.success("Course information Updated successfully!");
        
      })
      .catch((err) => {
        console.log("Error submitting course information:", err);
      });
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
        setCourses({
          ...courses,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  const handleCancel = () => {
    console.log(`Canceling form`);
  };

  useEffect(() => {
    setIsModalOpen(false); // Close modal when component unmounts
    return () => setIsModalOpen(false);
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Created Courses
      </Typography>
      <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
      <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
  {Array.isArray(courses) && courses.map((course) => (
    <div key={course._id} style={{ flex: '1 1 20' }}>
      <CourseCard
        course={course}
        type="instructor"
        onEnroll={handleCourseClick}
        onHover={handleHover}
        onDelete={handleDelete}
        onUpdate={() => handleUpdate(course._id)}
      />
    </div>
  ))}
</div>

      </div>
      {courses.length === 0 && <Typography>No created courses</Typography>}

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
                      Update Course
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
                        value={courses.title}
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
{/* {selectedCourse && selectedCourse.file && (
  <p>Original File Name: {selectedCourse.file}</p>
)} */}

                    
                    </div>

                    <div className="mb-4">
                      <textarea
                        id="description"
                        name="description"
                        value={courses.description}
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
                          value={courses.preRequisite}
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
                          value={courses.criteria}
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
                          value={courses.duration}
              
                          onChange={handleChange}
                          className="mt-1 p-2 w-full border"
                          placeholder="Course Duration"
                          required
                        />
                      </div>  */}
                    
                     
                        <select
                          id="category"
                          name="category"
                          value={courses.category}
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
                      <div id="categorypaid">
  <input
    type="radio"
    name="categorypaid"
    value="Free"
    checked={courses.categorypaid === 'Free'}
    onChange={handleChange}
    required
  /> Free
  <input
    type="radio"
    name="categorypaid"
    value="Paid"
    checked={courses.categorypaid === 'Paid'}
    onChange={handleChange}
    required
  /> Paid
</div>
                    </div>

                    {courses.categorypaid === "Paid" && (
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
                          value={courses.price} 
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
                        Update
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
};

export default CourseDisplay;
