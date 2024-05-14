import React, { useState, useEffect } from "react";
import { Modal, Table, Tooltip, Typography, message, Tag } from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

export default function UserDetails() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/allUsers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const columns = [
    {
      key: 1,
      title: "User's Name",
      // dataIndex: "firstName",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: 2,
      title: "Email",
      dataIndex: "email",
    },
    {
      key: 3,
      title: "Role",
      dataIndex: "accountType",
      render: (accountType) => {
        const roleMap = {
          Student: "student",
          Instructor: "instructor",
          // WorkshopOwner: "Workshop Owner",
        };
        return roleMap[accountType] || accountType;
      },
      filters: [
        { text: "Student", value: "student" },
        { text: "Instructor", value: "instructor" },
        // { text: "Workshop Owner", value: "WorkshopOwner" },
      ],
      onFilter: (value, record) => record.accountType === value,
    },
    {
      key: 4,
      title: "Verified",
      dataIndex: "verified",
      render: (verified) => (
        <Tag color={verified ? "green" : "red"} style={{ fontSize: 14 }}>
          {verified ? "Yes" : "No"}
        </Tag>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.verified === value,
    },
    {
      key: 5,
      title: "Blocked",
      dataIndex: "isBlocked",
      render: (isBlocked) => (
        <Tag color={isBlocked ? "red" : "green"} style={{ fontSize: 14 }}>
          {isBlocked ? "Yes" : "No"}
        </Tag>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isBlocked === value,
    },
    {
      key: 6,
      title: "Actions",
      render: (record) => {
        return (
          <>
            {record.isBlocked ? (
              <Tooltip title="Click to Unblock the user">
                <UserAddOutlined
                  onClick={() => onUnblock(record)}
                  style={{
                    color: "green",
                    fontSize: 20,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Click to Block the user">
                <UserDeleteOutlined
                  onClick={() => onBlock(record)}
                  style={{
                    color: "red",
                    fontSize: 20,
                    marginLeft: 10,
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Click to Delete the user">
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

  const onBlock = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/blockUser/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the user's isBlocked status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: true } : user
          )
        );
      } else {
        console.log(response);
        message.error("Failed to block user");
      }
    } catch (error) {
      message.error("Error blocking user");
    }
  };

  const onUnblock = async (record) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/unblockUser/${record._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        // Update the user's isBlocked status in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: false } : user
          )
        );
      } else {
        message.error("Failed to unblock user");
      }
    } catch (error) {
      message.error("Error unblocking user");
    }
  };

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user?",
      okText: "Yes",
      okType: "danger",
      onOk: async () => {
        await axios
          .delete(`http://localhost:8080/api/deleteUser/${record._id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              message.success(response.data.message);
              // Refresh the product list after deletion
              setUsers(users.filter((user) => user._id !== record._id));
            } else {
              console.log(response);
              message.error("Failed to delete user");
            }
          })
          .catch((error) => {
            message.error("Error deleting user");
          });
      },
    });
  };

  return (
    <>
      <Typography.Title level={2}>User Details</Typography.Title>
      <Table columns={columns} dataSource={users} />
    </>
  );
}
