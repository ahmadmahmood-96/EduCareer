import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Course = () => {
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

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      navigate("/InstructorDasboard", { state: { course: response.data } });
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
    navigate("/InstructorDasboard");
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

  return (
    <div className="mt-5 p-4 border-solid justify-items bg-white  max-w-md mx-auto">
      <div className="text-white bg-Teal text-3xl mb-8 ">
        {" "}
        Course Information
      </div>
      {successMessage && (
        <p className="text-green-500 mb-2">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block w-1/2 text-sm font-medium text-gray-700"
          >
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            placeholder="Enter the course title"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Course Description
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            placeholder="Enter the course description"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="criteria"
            className="block text-sm font-medium text-gray-700"
          >
            Course Completion Criteria
          </label>
          <input
            type="text"
            id="criteria"
            name="criteria"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            placeholder="Enter the completion criteria"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700"
          >
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            placeholder="Enter the course duration"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            required
          >
            <option value="" disabled selected>
              Select a category
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
            htmlFor="preRequisite"
            className="block text-sm font-medium text-gray-700"
          >
            Pre-Requisite
          </label>
          <input
            type="text"
            id="preRequisite"
            name="preRequisite"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            placeholder="Enter the pre-requisite (optional)"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="categorypaid"
            className="block text-sm font-medium text-gray-700"
          >
            Category (Paid/Free)
          </label>
          <select
            id="categorypaid"
            name="categorypaid"
            onChange={handleChange}
            className="mt-1 p-2 w-full border "
            required
          >
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
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
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
              placeholder="Enter the course price"
              required
            />
          </div>
        )}

        {/* <div className="mb-4">
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700"
          >
            Course Capacity
          </label>
          <input
            type="text"
            id="capacity"
            name="capacity"
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Enter the course capacity"
            required
          />
        </div> */}

        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            Add Image
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            className="mt-1 p-2 w-full border"
            accept="image/*"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
            type="submit"
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
  );
};

export default Course;
