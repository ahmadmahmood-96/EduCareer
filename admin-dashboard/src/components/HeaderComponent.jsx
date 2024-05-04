import React, { useEffect, useState } from "react";
import { Image, Space, Typography, Tooltip } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwtUtils";

const HeaderComponent = ({ collapsed, handleToggle }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const { name } = localStorage.getItem("token");
      setName(name);
    }
  }, [name, navigate]);

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
        <Image
          src="/AutoAidLogo.png"
          alt="AutoAid Logo"
          preview={false}
          width={110}
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer", filter: "invert(100%)" }}
        />
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
  backgroundColor: "#164863",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
};

export default HeaderComponent;
