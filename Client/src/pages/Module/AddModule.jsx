import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ModulePage = ({ courseId }) => {
  const [form] = Form.useForm();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [module, setModule] = useState([]);

  const viewFile = async () => {
    try {
      console.log("Calling viewFile function with courseId:", courseId);
      const result = await axios.get(
        `http://localhost:8080/api/ViewModule?courseId=${courseId}`
      );
      console.log("Received data:", result.data);
      setModule(result.data.data);
    } catch (error) {
      console.error("Axios error in viewFile:", error);
    }
  };

  useEffect(() => {
    viewFile();
  }, []);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", values.title);
    formData.append("file", file);
    formData.append("description", values.description);

    try {
      const result = await axios.post(
        `http://localhost:8080/AddModule?courseId=${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("sent data", result);
      alert("Module added to course");

      // Update the module state after submission
      viewFile();
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(
      `http://localhost:8080/modules/${file}`,
      "_blank",
      "noreferrer"
    );
  };
  
  const deleteModule = async (moduleId) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this module?');
    // Proceed with deletion if the module exists
    if (confirmDeletion) {
      const result = await axios.delete(
        `http://localhost:8080/api/DeleteModule/${moduleId}`
      );

      console.log("Deleted module:", result.data.message);

      // Update the module state after deletion
      viewFile();
    }
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: 800 }}>
    <div className="module-container bg-white mx-auto p-4 md:p-8">
      <Form
        form={form}
        encType="multipart/form-data"
        className="form-style"
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 10 }}
      >
        <Typography.Title level={2}>Add Module</Typography.Title>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the module title!" }]}
        >
          <Input placeholder="Enter Module Title" onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="File"
          name="file"
          rules={[{ required: true, message: "Please select a file!" }]}
        >
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter the module description!" }]}
        >
          <Input.TextArea placeholder="Enter Module Description" onChange={(e) => setDescription(e.target.value)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <div className="uploaded mt-8">
        <Typography.Title level={2}>Uploaded Content</Typography.Title>
        {Array.isArray(module) && module.length > 0 ? (
          module.map((data) => (
            <div key={data.title} className="module-item border p-4 mb-4">
              <Typography.Title level={4}>Title: {data.title}</Typography.Title>
              <Typography.Paragraph>Description: {data.description}</Typography.Paragraph>
              <Button
                type="primary"
                className="mt-2"
                onClick={() => showAssFiles(data.file)}
              >
                Show Content
              </Button>
              <Link
                to={`/UpdateModule/${data._id}`}
                className="text-blue-600 ml-2 hover:underline mt-2"
              >
                Update
              </Link>
              <Button
                danger
                className="ml-2 mt-2"
                onClick={(e) => deleteModule(data._id)}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default ModulePage;
