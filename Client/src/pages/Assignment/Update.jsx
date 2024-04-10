import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateAss = () => {
  const [file, setFile] = useState();
  const { Id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState({
    title: "",
    file: null,
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/Viewdetail/${Id}`)
      .then((result) => {
        const { title, file, dueDate, description } = result.data.data;
        console.log(result.data.data);
        setAssignment({
          title,
          file,
          dueDate: dueDate ? dueDate.slice(0, 16) : "",
          description,
        });
      })
      .catch((err) => console.log(err));
  }, [Id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAssignment({ ...assignment, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", assignment.title);
      formData.append("description", assignment.description);
      formData.append("dueDate", assignment.dueDate);
      formData.append("file", assignment.file);
      console.log(formData);
      const response = await axios.put(
        `http://localhost:8080/api/UpdateAssignment/${Id}`,
        formData
      );
      const updatedAssignment = response.data.data;
      alert("Assignment Updated")
      
      navigate("/InstructorDasboard", {
        state: { assignment: updatedAssignment },
      });
   
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div className=" bg-white p-8 ">
      <form
        className="max-w-lg mx-auto justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="text-white bg-Teal mr-100 text-3xl mb-8 ">
          {" "}
          Update Assignment
        </div>
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
            value={assignment.title}
            onChange={(e) =>
              setAssignment({ ...assignment, title: e.target.value })
            }
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
            onChange={handleFileChange}
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
            value={assignment.dueDate}
            onChange={(e) =>
              setAssignment({ ...assignment, dueDate: e.target.value })
            }
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
            value={assignment.description}
            rows="3"
            onChange={(e) =>
              setAssignment({ ...assignment, description: e.target.value })
            }
          ></textarea>
        </div>
        <button
          className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none "
          type="submit"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateAss;
