import React from "react";
import { Typography, Layout } from "antd";
const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer style={footerStyle}>
      <Typography.Text style={{ color: "white" }}>
        © 2024 Copyright <b> EduCareer</b>. All Rights Reserved
      </Typography.Text>
    </Footer>
  );
};

const footerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "sticky",
  bottom: "0px",
  height: 55,
  width: "100vw",
  color: "#fff",
  backgroundColor: "#3F9495",
};

export default FooterComponent;
