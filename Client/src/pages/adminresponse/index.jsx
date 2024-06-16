import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from "../../components/Navbar/NavbarPage";
import {
  Modal,
  Form,
  Table,
  Button,
  Tooltip,
  Typography,
  Input,
  Tag,
  message,
} from "antd";
import { FileOutlined, WechatOutlined } from "@ant-design/icons";

const AdminSupport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/support-details/${userToken}`
      );
      setData(response.data); // Update the data state with the fetched data
    } catch (error) {
      console.error("Error fetching support details:", error);
    }
  };

  const showFile = async (fileName) => {
    try {
      window.open(`http://localhost:8080/api/files/${fileName}`, "_blank");
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const onResponse = (record) => {
    // Logic for sending response
  };

  const columns = [
    {
      key: 1,
      title: "Subject",
      dataIndex: "subject",
    },
    {
      key: 2,
      title: "Description",
      dataIndex: "description",
    },
    {
      key: 3,
      title: "Attachments",
      render: (record) => {
        return record.attachment ? (
          <Tooltip title="Click to see the file">
            <FileOutlined
              onClick={() => showFile(record.attachment)}
              style={{
                fontSize: 20,
                cursor: "pointer",
              }}
            />
          </Tooltip>
        ) : (
          "----"
        );
      },
    },
    {
      key: 4,
      title: "Response",
      render: (record) =>
        record.response ? record.response : "No response from the admin",
    },
    {
      key: 5,
      title: "Status",
      dataIndex: "response",
      render: (response) => (
        <Tag color={response ? "green" : "orange"} style={{ fontSize: 14 }}>
          {response ? "Resolved" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: "Resolved", value: true },
        { text: "Pending", value: false },
      ],
      onFilter: (value, record) => !!record.response === value,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Topbar />
      <>
        <Typography.Title level={2}>Support Section</Typography.Title>
        <Table columns={columns} dataSource={data} />
      </>
    </div>
  );
};

export default AdminSupport;
