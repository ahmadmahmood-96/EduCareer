import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const SubmittedAssignments = () => {
  const { Id } = useParams();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  const handleCheckPlagiarism = async () => {
    try {
      const formData = new FormData();
      //const filesWithPaths = [];
      let names = [];
      let files = [];

      submittedAssignments.forEach((assignment) => {
        names.push(assignment.fileName);
        files.push(assignment.subfile);
      });

      console.log(names);
      console.log(files);

      formData.append("files", files);
      formData.append("names", names);

      // Send data to backend for plagiarism check
      const response = await axios.post(
        "http://192.168.0.107:5000/uploader",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(
      `http://localhost:8080/subfiles/${file}`,
      "_blank",
      "noreferrer"
    );
  };

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/submitted-assignments/${Id}`
        );

        setSubmittedAssignments(response.data);
      } catch (error) {
        console.error("Error fetching submitted assignments:", error);
      }
    };

    fetchSubmittedAssignments();
  }, [Id]);

  return (
    <div className="p-5 m-8">
      <div className="text-3xl">Submitted Assignments</div>
      <button
        className="mt-2 px-4 py-2 bg-Teal text-white "
        onClick={handleCheckPlagiarism}
      >
        Check Plagiarism
      </button>

      <table className="mt-5 min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-Teal text-white">
            <th className="py-2 px-4 border-b">Submission Time</th>
            <th className="py-2 px-4 border-b">Assignment Title</th>
            <th className="py-2 px-4 border-b">Submitted By</th>
            <th className="py-2 px-4 border-b">Submission File</th>
          </tr>
        </thead>
        <tbody>
          {submittedAssignments.map((assignment) => (
            <tr key={assignment._id}>
              <td className="py-2 px-4 border-b border-r">
                {new Date(assignment.submissionTime).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b border-r">
                {assignment.assignmentId.title}{" "}
              </td>
              <td className="py-2 px-4 border-b border-r">
                {assignment.userId.firstName} {assignment.userId.lastName}
              </td>
              <td className="py-2 px-4 border-b border-r">
                <button onClick={() => showAssFiles(assignment.subfile)}>
                  View File
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmittedAssignments;
