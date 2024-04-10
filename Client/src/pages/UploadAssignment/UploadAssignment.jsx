import React, { useEffect, useState } from "react";
import axios from "axios";


const UploadAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [fileInputs, setFileInputs] = useState({}); 
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  


  useEffect(() => {
    const userToken = localStorage.getItem('token');
    console.log(userToken);
    axios.get(`http://localhost:8080/api/user/${userToken}/enrolled-assignments`)
      .then((response) => {
        setAssignments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching assignments:', error);
      });
  }, []);


  useEffect(() => {
    // Initialize fileInputs state with empty values for each assignment
    const initialFileInputs = {};
    assignments.forEach((assignment) => {
      initialFileInputs[assignment._id] = null;
    });
    setFileInputs(initialFileInputs);
  }, [assignments]); // Run this effect when assignments change

  
  const handleFileInputChange = (assignmentId, event) => {
    const selectedFile = event.target.files[0];
    setFileInputs((prevFileInputs) => ({
      ...prevFileInputs,
      [assignmentId]: selectedFile,
    }));
  };

 

  const isDueDatePassed = (dueDate) => {
    const currentDateTime = new Date();
    const assignmentDueDate = new Date(dueDate);
    return currentDateTime > assignmentDueDate;
  };

  const handleSubmit = (assignmentId) => {
    const userToken = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("userId", userToken);
    formData.append("courseId", assignments.find((a) => a._id === assignmentId).courseId._id);
    formData.append("assignmentId", assignmentId);
    formData.append("subfile", fileInputs[assignmentId]);
    formData.append("fileName", fileInputs[assignmentId].name);

    axios
      .post("http://localhost:8080/api/submitassignment", formData)
      .then((response) => {
        // Handle successful submission (if needed)
        console.log("Assignment submitted successfully:", response.data);
        alert("Assignment Submitted")
      })
      .catch((error) => {
        console.error("Error submitting assignment:", error);
      });
  };



  return (
    <div>
      <div className="text-3xl">Assignments</div>
      <table className="mt-5 min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-Teal text-white">
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Due Date</th>
            <th className="py-2 px-4 border-b">Course Name</th>
            <th className="py-2 px-4 border-b">File</th>
            <th className="py-2 px-4 border-b">Submission</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={assignment._id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="py-2 px-4 border-b border-r">{assignment.title}</td>
              <td className="py-2 px-4 border-b border-r">{assignment.description}</td>
              <td className="py-2 px-4 border-b border-r">{assignment.dueDate}</td>
              <td className="py-2 px-4 border-b border-r">{assignment.courseId.title}</td>
              <td className="py-2 px-4 border-b border-r">
                <button
                  onClick={() => window.open(`http://localhost:8080/files/${assignment.file}`, "_blank", "noreferrer")}
                >
                  Open File
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <input
                  type="file"
                  accept="*/*"
                  onChange={(e) => handleFileInputChange(assignment._id, e)}
                />
                <button
                  onClick={() => handleSubmit(assignment._id, assignment.dueDate)}
                  disabled={isDueDatePassed(assignment.dueDate)}
                  className={`px-4 py-2 bg-Teal text-white ${isDueDatePassed(assignment.dueDate) ? 'cursor-not-allowed' : 'hover:bg-gray-700'}`}
                >
                  Submit
                </button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadAssignment;