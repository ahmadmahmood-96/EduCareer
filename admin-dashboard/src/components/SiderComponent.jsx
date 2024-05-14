import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SolutionOutlined ,
  LogoutOutlined,
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  SafetyOutlined,
  BookOutlined,
} from "@ant-design/icons";

const SiderComponent = () => {
  const navigate = useNavigate();

  const onClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/");
    } else {
      navigate(key);
    }
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: "100%",
        backgroundColor: "#DDF2FD",
      }}
      selectedKeys={[window.location.pathname]}
      mode="inline"
      items={items}
    />
  );
};

const items = [
  { key: "/home", label: "Dashboard", icon: <HomeOutlined /> },
 
 
  { key: "/home/course-details", label: "Course Details", icon: <BookOutlined /> },
  { key: "/home/user-details", label: "User Details", icon: <UserOutlined /> },
  { key: "/home/support-section", label: "Support Section", icon: <SolutionOutlined /> },
  {
    key: "/home/order-details",
    label: "Order Details",
    icon: <ShopOutlined />,
  },
  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
];

export default SiderComponent;
