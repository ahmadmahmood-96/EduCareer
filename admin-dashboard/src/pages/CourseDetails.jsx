import React, { useState, useEffect } from "react";
import { Modal, Table, Tooltip, Typography, message, Tag } from "antd";
import {
  DeleteOutlined
} from "@ant-design/icons";
import axios from "axios";

export default function CourseDetails() {
  const [course, setCourse] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/allCourses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const columns = [
    {
      key: 1,
      title: "Course Title",
      // dataIndex: "firstName",
      dataIndex: "title",
    },
    {
      key: 2,
      title: "Description",
      dataIndex: "description",
    },
    {
      key: 3,
      title: "Instructor",
      dataIndex: "instructor",
    },

    {
      key: 8,
      title: "Email",
      // dataIndex: "email",
      render: (_, record) => {
        if (record.instructorEmail) {
          return record.instructorEmail;
        } else {
          return "N/A";
        }
      },
    },

    {
      key: 4,
      title: "Category",
      dataIndex: "category",
    },

    {
      key: 5,
      title: "Type",
      dataIndex: "categorypaid",
      render: (categorypaid) => {
        const roleMap = {
          Paid: "Paid",
          Free: "Free",
          // WorkshopOwner: "Workshop Owner",
        };
        return roleMap[categorypaid] || categorypaid;
      },
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Free", value: "Free" },
      ],
      onFilter: (value, record) => record.categorypaid === value,
    },

    {
      key: 6,
      title: "Price",
      dataIndex: "price",
      render: (_, record) => {
        if (record.price) {
          return record.price;
        } else {
          return "N/A";
        }
      },
      sorter: (a, b) => a.price- b.price,
    },
   
    {
      key: 7,
      title: "Actions",
      render: (record) => {
        return (
          <>
            <Tooltip title="Click to Delete the course">
              <DeleteOutlined
                onClick={() => onDelete(record)}
                style={{
                  color: "red",
                  fontSize: 20,
                  marginLeft: 15,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  
  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this course?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`http://localhost:8080/api/deletecourses/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the product list after deletion
              setCourse(course.filter((course) => course._id !== record._id));
            } else {
              console.log(response);
              message.error("Failed to delete course");
            }
          })
          .catch((error) => {
            message.error("Error deleting course");
          });
      },
    });
  };

  return (
    <>
      <Typography.Title level={2}>Course Details</Typography.Title>
      <Table columns={columns} dataSource={course} />
    </>
  );
}
