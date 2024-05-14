import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Typography, Form, Input, Button, DatePicker, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Assignment = ({ courseId }) => {
  const [form] = Form.useForm();
  const [assignment, setAssignment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Assignment component received courseId:", courseId);
    viewFile();
  }, [courseId]);

  const viewFile = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8080/api/View?courseId=${courseId}`
      );
      setAssignment(result.data.data);
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("title", values.title);
    formData.append("file", values.file[0].originFileObj);
    formData.append("dueDate", values.dueDate.format("YYYY-MM-DD HH:mm:ss"));
    formData.append("description", values.description);

    try {
      const result = await axios.post(
        `http://localhost:8080/api/Upload?courseId=${courseId}`,
        formData
      );
      message.success("Assignment Uploaded");
      console.log(result);
      viewFile();
      form.resetFields();
    } catch (error) {
      console.error("Axios error:", error);
      message.error("Failed to upload assignment. Please try again.");
    }
  };

  const handleDelete = async (assignmentId) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this assignment?"
    );
    if (confirmDeletion) {
      try {
        await axios.delete(`http://localhost:8080/api/deleteAss/${assignmentId}`);
        viewFile();
      } catch (error) {
        console.error("Axios error:", error);
      }
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(`http://localhost:8080/files/${file}`, "_blank", "noreferrer");
  };

  const handleSubmissions = (assignmentId) => {
    navigate(`/submitted-assignments/${assignmentId}`);
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: 800 }}>
    <div className="module-container bg-white mx-auto p-4 md:p-8">
      <Typography.Title level={2}>Add Assignment</Typography.Title>
      <Form
        form={form}
       // encType="multipart/form-data"
        className="form-style"
        onFinish={onFinish}
        labelCol={{ span: 6}}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter the title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          name="file"
          label="Choose File"
          rules={[{ required: true, message: "Please choose a file!" }]}
          getValueFromEvent={(e) => e.fileList}
          valuePropName="fileList"
        >
          <Upload beforeUpload={() => false} multiple={false}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date and Time"
          rules={[{ required: true, message: "Please select the due date and time!" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <TextArea placeholder="Enter description" rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <div className="uploaded mt-8">
        <Typography.Title level={2}>Uploaded Assignments</Typography.Title>
        {Array.isArray(assignment) && assignment.length > 0 ? (
          assignment.map((data) => (
            <div key={data._id} className="module-item border p-4 mb-4">
              <Typography.Title level={4}>Title: {data.title}</Typography.Title>
              <Typography.Paragraph>Description: {data.description}</Typography.Paragraph>
              <Button
                type="primary"
                className="mt-2"
                onClick={() => showAssFiles(data.file)}
              >
                Show PDF
              </Button>
              <Link
                to={`/updateAss/${data._id}`}
                className="text-blue-600 ml-2 hover:underline mt-2"
              >
                Update
              </Link>
              <Button
                danger
                className="ml-2 mt-2"
                onClick={() => handleDelete(data._id)}
              >
                Delete
              </Button>
              <Button
                type="default"
                className="ml-2 mt-2"
                onClick={() => handleSubmissions(data._id)}
              >
                Submissions
              </Button>
            </div>
          ))
        ) : (
          <p>No assignments available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Assignment;
