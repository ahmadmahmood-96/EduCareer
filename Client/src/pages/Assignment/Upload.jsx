import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Assignment = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [assignment, setAssignment] = useState([]);
  const [responses, setResponses] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Assignment component received courseId:", courseId);
    viewFile();
  }, [courseId]);

  const viewFile = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/View?courseId=${courseId}`
      );
      setAssignment(result.data.data);

      // Fetch responses for each assignment
      // const responsePromises = result.data.data.map(async (assignment) => {
      //   const responseResult = await axios.get(
      //     `http://localhost:8080/api/submitassignment/responses?assignmentId=${assignment._id}`
      //   );
      //   return {
      //     assignmentId: assignment._id,
      //     responses: responseResult.data.data,
      //   };
      // });

      // const responsesData = await Promise.all(responsePromises);
      // setResponses(responsesData);
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", title);
    formData.append("file", file);
    formData.append("dueDate", dueDate);
    formData.append("description", description);

    try {
      const result = await axios.post(
        `http://localhost:8080/api/Upload?courseId=${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Assignment Uploaded")
      console.log(result);
      viewFile();
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(`http://localhost:8080/files/${file}`, "_blank", "noreferrer");
  };

  const handleDelete = async (assignmentId) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this assignment?');
    if (confirmDeletion) {
    try {
      await axios.delete(`http://localhost:8080/api/deleteAss/${assignmentId}`);
      viewFile();
    } catch (error) {
      console.error("Axios error:", error);
    }
  }
  };

  const handleSubmissions = (assignmentId) => {
    navigate(`/submitted-assignments/${assignmentId}`, 
    // { state: { courseId } }
    );
  };

  return (
    <div className=" bg-white mx-auto p-4 md:p-8 ">
      <form className=" mx-auto" onSubmit={submitFile}>
        <h4 className="text-2xl font-semibold mb-4">Add Assignment</h4>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="form-input w-full sm:w-2/3 border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2"
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Choose File:
          </label>
          <input
            type="file"
            id="file"
            className="form-input w-full sm:w-2/3 border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2"
            accept="*/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Due Date and Time:
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            className="form-input w-full sm:w-2/3 border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Description:
          </label>
          <textarea
            id="description"
            className="form-input w-full sm:w-2/3 border border-gray-300 focus:outline-none focus:border-blue-500 px-4 py-2"
            placeholder="Enter description"
            rows="3"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button
          className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="uploaded mt-8">
        <h4 className="text-2xl font-semibold mb-4">Uploaded Assignments</h4>
        {Array.isArray(assignment) && assignment.length > 0 ? (
          assignment.map((data) => (
            <div key={data._id} className="mb-4 p-4 border border-gray-300 ">
              <h6 className="text-lg font-semibold mb-2">
                Title: {data.title}
              </h6>
              <p className="mb-2">Description: {data.description}</p>
              <p className="mb-2">Due Date and Time: {data.dueDate}</p>

              <button
                className="bg-Teal text-white mx-3 mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none "
                onClick={() => showAssFiles(data.file)}
              >
                Show PDF
              </button>
              <Link
                to={`/updateAss/${data._id}`}
                className="bg-white text-Teal mx-3 mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-non"
              >
                Update
              </Link>
              <button
                className="bg-red-500 text-white mx-3 mt-2 px-4 py-2  hover:bg-red-600 focus:outline-non "
                onClick={() => handleDelete(data._id)}
              >
                Delete
              </button>
              <button className="bg-green-500 text-white mx-3 mt-2 px-4 py-2  hover:bg-red-600 focus:outline-non"  
                onClick={() => handleSubmissions(data._id)}
                >
                 Submissions
                </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>
    </div>
  );
};

export default Assignment;
