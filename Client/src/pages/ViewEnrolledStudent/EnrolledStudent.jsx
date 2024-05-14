import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tooltip, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const EnrolledStudent = ({ courseId }) => {
  const [enrolledStudents, setEnrolledStudents] = useState([]);

  useEffect(() => {
    console.log(courseId);
    axios
      .get(
        `http://localhost:8080/api/enrollments/course/${courseId}/enrolled-students`
      )
      .then((response) => {
        setEnrolledStudents(response.data);
        console.log(enrolledStudents);
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
        await axios.delete(
          `http://localhost:8080/api/expel/${studentId}/enrolled-students`
        );

        const updatedEnrolledStudents = enrolledStudents.filter(
          (student) => student.userId?._id !== studentId
        );
        setEnrolledStudents(updatedEnrolledStudents);
        console.log(enrolledStudents);

        console.log(`Student with ID ${studentId} expelled successfully`);
      } catch (error) {
        console.error("Error expelling student:", error);
      }
    }
  };

  const columns = [
    {
      key: "name",
      title: "Student's Name",
      dataIndex: "studentName",
    },
    {
      key: "action",
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Tooltip title="Click to expel student">
          <DeleteOutlined
            onClick={() => handleExpelClick(record.userId?._id, record.name)}
            style={{
              fontSize: 20,
              marginLeft: 10,
              cursor: "pointer",
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
    <div style={{ margin: "0 auto", maxWidth: 800 }}>
      <Typography.Title level={2}>Enrolled Students</Typography.Title>
      <Table columns={columns} dataSource={enrolledStudents} />
      </div>
    </>
  );
};

export default EnrolledStudent;
