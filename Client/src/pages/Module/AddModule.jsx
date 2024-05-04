import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const ModulePage = ({ courseId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [module, setModule] = useState([]);

  const viewFile = async () => {
    try {
      console.log("Calling viewFile function with courseId:", courseId);
      const result = await axios.get(
        `http://localhost:8080/api/ViewModule?courseId=${courseId}`
      );
      console.log("Received data:", result.data);
      setModule(result.data.data);
    } catch (error) {
      console.error("Axios error in viewFile:", error);
    }
  };

  useEffect(() => {
    viewFile();
  }, []);

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", title);
    formData.append("file", file);
    formData.append("description", description);

    try {
      const result = await axios.post(
        `http://localhost:8080/AddModule?courseId=${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("sent data", result);
      alert("Module added to course")

      // Update the module state after submission
      viewFile();
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(
      `http://localhost:8080/modules/${file}`,
      "_blank",
      "noreferrer"
    );
  };
  const deleteModule = async (moduleId) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this module?');
    // Proceed with deletion if the module exists
    if (confirmDeletion) {
    const result = await axios.delete(
      `http://localhost:8080/api/DeleteModule/${moduleId}`
    );

    console.log("Deleted module:", result.data.message);

    // Update the module state after deletion
    viewFile();
  };

}

  return (
    <div className="module-container bg-white  mx-auto p-4 md:p-8">
      <form
        encType="multipart/form-data"
        className="form-style"
        onSubmit={submitFile}
      >
        <h4 className="text-2xl font-bold mb-4">Add Module</h4>
        <input
          type="text"
          className="form-control mb-2 p-2 border  w-full"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          className="form-control mb-2 p-2 border w-full"
          accept="*/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description:
        </label>
        <textarea
          className="form-control mb-2 p-2 border w-full"
          placeholder="Enter a description"
          rows="3"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none"
          type="submit"
        >
          Submit
        </button>
      </form>
      <div className="uploaded mt-8">
        <h4 className="text-2xl font-bold mb-4">Uploaded Content</h4>
        {Array.isArray(module) && module.length > 0 ? (
          module.map((data) => (
            <div key={data.title} className="module-item border p-4 mb-4">
              <h6 className="text-xl font-semibold mb-2">
                Title: {data.title}
              </h6>
              <p className="mb-2">Description: {data.description}</p>
              <button
                className="bg-Teal text-white mt-2 mx-3 px-4 py-2  hover:bg-teal-600 focus:outline-none"
                onClick={() => showAssFiles(data.file)}
              >
                Show Content
              </button>
              <Link
                to={`/UpdateModule/${data._id}`}
                className="bg-white text-Teal mt-2 mx-3 px-4 py-2  hover:bg-teal-600 focus:outline-none"
              >
                Update
              </Link>
              <button
                className="bg-red-500 text-white mt-2 mx-3 px-4 py-2  hover:bg-red-600 focus:outline-none"
                onClick={(e) => deleteModule(data._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
  );
};

export default ModulePage;