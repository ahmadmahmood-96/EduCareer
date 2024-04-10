import React, { useState, useEffect } from "react";
import axios from "axios";

const EnrolledStudent = ({ courseId }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    console.log(courseId);
    axios
      .get(
        `http://localhost:8080/api/enrollments/course/${courseId}/enrolled-students`
      )
      .then((response) => {
        //  console.log(response.data);
        setEnrolledStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching enrolled students:", error);
      });
  }, [courseId]);

  const handleExpelClick = async (studentId, studentName) => {
    const confirmExpel = window.confirm(
      `Are you sure you want to expel ${studentName}?`
    );

    if (confirmExpel) {
      try {
        // Send a DELETE request to the expulsion API endpoint
        await axios.delete(
          `http://localhost:8080/api/expel/${studentId}/enrolled-students`
        );

        // If the expulsion is successful, update the enrolled students
        const updatedEnrolledStudents = enrolledStudents.filter(
          (student) => student.userId?._id !== studentId
        );
        setEnrolledStudents(updatedEnrolledStudents);

        console.log(`Student with ID ${studentId} expelled successfully`);
      } catch (error) {
        console.error("Error expelling student:", error);
      }
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Enrolled Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((course, index) => (
              <tr
                key={course._id}
                className={index % 2 === 0 ? "bg-gray-100" : ""}
              >
                <td className="py-2 px-4 border-b">
                  {course.studentName || "N/A"}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() =>
                      handleExpelClick(course.userId?._id, course.studentName)
                    }
                  >
                    Expel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrolledStudent;
