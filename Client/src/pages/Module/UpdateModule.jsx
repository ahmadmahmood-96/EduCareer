import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateModule = () => {
  const { Id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState({
    title: "",
    file: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/ViewdetailModule/${Id}`)
      .then((result) => {
        const { title, file, description } = result.data.data;
        setModule({
          title,
          file,
          description,
        });
      })
      .catch((err) => console.log(err));
  }, [Id]);

  const handleFileChange = (e) => {
    setModule({ ...module, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", module.title);
      formData.append("description", module.description);
      formData.append("file", module.file);

      const response = await axios.put(
        `http://localhost:8080/api/UpdateModule/${Id}`,
        formData
      );
      const updatedModule = response.data.data;
      alert("Course Module Information Updated");
      navigate("/InstructorDasboard", { state: { module: updatedModule } });
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className=" bg-white p-8  max-w-md mx-auto">
      <form className="max-w-lg mx-auto">
        {/* <h4 className="text-2xl font-semibold mb-4">Update Module</h4> */}
        <div className="text-white bg-Teal text-3xl mb-8 "> Update Module</div>
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
            className="form-input w-full  border focus:outline-none focus:border-blue-500 px-4 py-2"
            placeholder="Enter title"
            value={module.title}
            onChange={(e) => setModule({ ...module, title: e.target.value })}
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
            className="form-input w-full  border focus:outline-none focus:border-blue-500 px-4 py-2"
            accept="*/*"
            onChange={handleFileChange}
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
            className="form-input w-full  border focus:outline-none focus:border-blue-500 px-4 py-2"
            placeholder="Enter description"
            value={module.description}
            rows="3"
            onChange={(e) =>
              setModule({ ...module, description: e.target.value })
            }
          ></textarea>
        </div>
        <button
          className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-none "
          onClick={handleSubmit}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateModule;
