import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "tailwindcss/tailwind.css";

function Updatecourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    description: "",
    criteria: "",
    instructor: "",
    duration: "",
    category: "",
    preRequisite: "",
    categorypaid: "",
    price: "",
    capacity: "",
    file: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/updatecourses/${id}`)
      .then((result) => {
        console.log("Fetched Data:", result.data);
        setCourse((prevState) => ({
          ...prevState,
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
  }, [id]);
  const handleFileChange = (e) => {
    setmodule({ ...course, file: e.target.files[0] });
  };

  const updatecourse = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/updatecourses/${id}`, course)
      .then((result) => {
        console.log("Course Information Submitted:", result.data);
        alert("Course Information Updated");
        navigate("/InstructorDasboard", { state: { course: result.data } });
      })
      .catch((err) => {
        console.log("Error submitting course information:", err);
      });
  };

  return (
    <div className="container mx-auto max-w-md mt-5">
      <div className="text-white bg-Teal text-3xl mb-8 "> Update Course</div>
      {course.title ? (
        <form className="course-form" onSubmit={updatecourse}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="mt-1 p-2 border  w-full"
              name="title"
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description<span style={{ color: "red" }}>*</span>:
            </label>
            <textarea
              className="mt-1 p-2 border  w-full"
              name="description"
              value={course.description}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="criteria"
              className="block text-sm font-medium text-gray-700"
            >
              Course Completion Criteria<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              className="mt-1 p-2 border  w-full"
              name="criteria"
              value={course.criteria}
              onChange={(e) =>
                setCourse({ ...course, criteria: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700"
            >
              Instructor<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="mt-1 p-2 border  w-full"
              name="instructor"
              value={course.instructor}
              onChange={(e) =>
                setCourse({ ...course, instructor: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              type="text"
              className="mt-1 p-2 border  w-full"
              name="duration"
              value={course.duration}
              onChange={(e) =>
                setCourse({ ...course, duration: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category<span style={{ color: "red" }}>*</span>:
            </label>
            <input
              className="mt-1 p-2 border  w-full"
              name="category"
              value={course.category}
              onChange={(e) =>
                setCourse({ ...course, category: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="preRequisite"
              className="block text-sm font-medium text-gray-700"
            >
              Pre-Requisite:
            </label>
            <input
              className="mt-1 p-2 border  w-full"
              name="preRequisite"
              value={course.preRequisite}
              onChange={(e) =>
                setCourse({ ...course, preRequisite: e.target.value })
              }
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="categorypaid"
              className="block text-sm font-medium text-gray-700"
            >
              Category (Paid/Free)<span style={{ color: "red" }}>*</span>:
            </label>
            <select
              className="mt-1 p-2 border  w-full"
              name="categorypaid"
              value={course.categorypaid}
              onChange={(e) =>
                setCourse({ ...course, categorypaid: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
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
                Price<span style={{ color: "red" }}>*</span>:
              </label>
              <input
                className="mt-1 p-2 border  w-full"
                name="price"
                value={course.price}
                onChange={(e) =>
                  setCourse({ ...course, price: e.target.value })
                }
                required
              />
            </div>
          )}
          <input
            className="mt-1 p-2 border w-full"
            type="file"
            accept="image/*"
            name="file"
            onChange={handleFileChange}
          />
          {/* <div className="mb-4">
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700"
            >
              Course Capacity<span style={{ color: "red" }}>*</span>: */}
          {/* </label>
            <input
              className="mt-1 p-2 border w-full"
              name="capacity"
              value={course.capacity}
              onChange={(e) =>
                setCourse({ ...course, capacity: e.target.value })
              }
              required
            />
          </div> */}

          <div className="text-center mt-3">
            <button
              type="submit"
              className="bg-Teal text-white mt-2 px-4 py-2 mb-5 hover:bg-teal-600 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Updatecourse;
