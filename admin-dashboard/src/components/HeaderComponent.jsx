import React, { useEffect, useState } from "react";
import { Image, Space, Typography, Tooltip } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const HeaderComponent = ({ collapsed, handleToggle }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem("token"); 
        const response = await axios.get(`http://localhost:8080/api/admin/${userId}`);
        const fullName  = response.data;
        setName(fullName);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserName();
    }
  }, [navigate]);

  return (
    <header style={headerStyle}>
      <Space size="large">
        <Tooltip title="Click to toggle the Sidebar" color="black">
          {collapsed ? (
            <MenuUnfoldOutlined
              style={{ fontSize: 26, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          ) : (
            <MenuFoldOutlined
              style={{ fontSize: 26, color: "#fbfbfb" }}
              onClick={handleToggle}
            />
          )}
        </Tooltip>

        <Typography.Text
          style={{ fontSize: 17, fontWeight: "bold", color: "#fbfbfb" }}
        >
          EduCareer
        </Typography.Text>
       
      </Space>
      <Space size="large">
        <Typography.Text
          style={{ fontSize: 17, fontWeight: "normal", color: "#fbfbfb" }}
        >
          {name}
        </Typography.Text>
      </Space>
    </header>
  );
};

const headerStyle = {
  color: "#fff",
  height: 55,
  backgroundColor: "#2F6C6D",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export default HeaderComponent;
