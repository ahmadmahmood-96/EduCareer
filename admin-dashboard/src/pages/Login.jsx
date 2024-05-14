import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Typography,
  Flex,
  Row,
  Col,
  message,
  Image,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "EduCareer - Login";
    if (localStorage.getItem("token")) navigate("/home");
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/login-detail`, values);
      console.log(response.data);
      
      // const { data: res } = await axios.post(url, state);
      // localStorage.setItem("token", res.data.userId);
      // localStorage.setItem("account type", res.data.accountType);
      // window.dispatchEvent(new Event('storageChange'));
      // console.log(res.data);
      // navigate("/home");

      if (response.status === 200) {
        console.log("tokennn",response.data.data.userId);
        localStorage.setItem("token",  response.data.data.userId);
        message.success(response.data.message);
        //console.log("token",localStorage.getItem());
        setEmail("");
        setPassword("");
        navigate("/home", { replace: true });
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data && error.response.data.message) {
        // If there's a specific error message in the response, show it
        message.error(error.response.data.message);
      } 
    }
  };
  
  const validateEmail = (rule, value) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address");
    }
    return Promise.resolve();
  };

  return (
    <Row
      align="middle"
      justify="center"
      style={{ height: "100vh", margin: 0, padding: 0 }}
    >
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 12, order: 2 }}
        lg={{ span: 12, order: 2 }}
        xl={{ span: 12, order: 2 }}
        style={{ margin: 0, padding: 0 }}
      >
        <Flex
          gap="middle"
          vertical
          style={{
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <Typography.Title level={2}>Login</Typography.Title>
          <Form
            layout="vertical"
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Typography.Link
              href="/forgot-password"
              style={{
                color: "#008b0e",
              }}
            >
              Forgot Password?
            </Typography.Link>

            <Form.Item
              wrapperCol={{
                offset: 0,
                span: 16,
              }}
              style={{ paddingTop: 20 }}
            >
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
      <Col
        xs={{ span: 24 }}
        sm={{ span: 24 }}
        md={{ span: 24, order: 2 }}
        lg={{ span: 12, order: 1 }}
        xl={{ span: 12, order: 1 }}
        style={{
          backgroundColor: "#2F6C6D",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%", // Set 50% height for screens smaller than md
          margin: 0,
        }}
      >
        <Flex vertical gap="middle" align="center">
          {/* <Image src="AutoAidLogo.png" alt="AutoAid Logo" preview={false} /> */}
          <Typography.Title
            level={2}
            style={{ fontWeight: "bold", textAlign: "center",  color:"#fff"}}
          >
            EduCareer Admin Dashboard
          </Typography.Title>
        </Flex>
      </Col>
    </Row>
  );
}
