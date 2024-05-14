import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Table, Tooltip, Typography, message, Tag, Upload, Form, Button } from "antd";
import {UploadOutlined, FileOutlined } from "@ant-design/icons";
import { FileInput } from "lucide-react";


const UploadAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [fileInputs, setFileInputs] = useState({}); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [filename, setFileName]  = useState('');
 
  


  useEffect(() => {
    const userToken = localStorage.getItem('token');
    console.log(userToken);
    axios.get(`http://localhost:8080/api/user/${userToken}/enrolled-assignments`)
      .then((response) => {
        setAssignments(response.data);
        console.log(assignments[0].title)
      })
      .catch((error) => {
        console.error('Error fetching assignments:', error);
      });
  }, []);


  useEffect(() => {
    // Initialize fileInputs state with empty values for each assignment
    const initialFileInputs = {};
    assignments.forEach((assignment) => {
      initialFileInputs[assignment._id] = null;
    });
    setFileInputs(initialFileInputs);
    console.log(fileInputs);
  }, [assignments]); // Run this effect when assignments change

  
  const handleFileInputChange = (assignmentId, event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);
    setFileName(selectedFile.name)

    setFileInputs((prevFileInputs) => ({
      ...prevFileInputs,
      [assignmentId]: selectedFile,
    }));
  };

 

  const isDueDatePassed = (dueDate) => {
    const currentDateTime = new Date();
    const assignmentDueDate = new Date(dueDate);
    return currentDateTime > assignmentDueDate;
  };

  const customRequest = ({ file, onSuccess, onError }) => {
    onSuccess();
    console.log(file)
  };

  const handleSubmit = (assignmentId) => {
    console.log(assignmentId);
    const userToken = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("userId", userToken);
    formData.append("courseId", assignments.find((a) => a._id === assignmentId).courseId._id);
    formData.append("assignmentId", assignmentId);
    formData.append("subfile", fileInputs[assignmentId]);
    formData.append("fileName", filename);

    axios
      .post("http://localhost:8080/api/submitassignment", formData)
      .then((response) => {
        // Handle successful submission (if needed)
        console.log("Assignment submitted successfully:", response.data);
        alert("Assignment Submitted")
      })
      .catch((error) => {
        console.error("Error submitting assignment:", error);
      });
  };


  const columns = [
    {
      key: 1,
      title: "Title",
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
      title: "Due Date",
      dataIndex: "dueDate",
      render: (dueDate) => {
        const formattedDate = new Date(dueDate).toLocaleString();
        return <span>{formattedDate}</span>;
      },
    },

    {
      key: 8,
      title: "Course Name",
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
      title: "File",
      dataIndex: "file",
      render: (_, record) => (
        <Button
          type="link"
          icon={<FileOutlined />}
          onClick={() => window.open(`http://localhost:8080/files/${record.file}`, "_blank", "noreferrer")}
        >
          Open File
        </Button>
      ),
    },
    {
      key: 6,
      title: "Actions",
      width: 150,
      render: (record) => {
        return (
          <>
            <Tooltip title="Click to upload the file">
              <Button 
                onClick={() => onSubmitModal(record)}
                disabled={isDueDatePassed(record.dueDate)}
                icon={<FileOutlined />}
              >
                Upload
                </Button>
            </Tooltip>
          </>
        );
      },
    },
    

  ];
  const onSubmitModal = (record) => {
    setShowEditModal(true);
    setRecord(record);
  };

  return (
    <div>
      <Typography.Title level={2}>Assignments</Typography.Title>
      <Table columns={columns} dataSource={assignments} />
      <Modal
        title="Upload File"
        open={showEditModal}
        okText="Save"
        onOk={() => handleSubmit(record._id)}
        onCancel={() => setShowEditModal(false)}
      >
        <Form.Item
      name="upload"
      label="Upload"
      valuePropName="fileList"
      accept=".docx .pdf"
      customRequest={customRequest}
      onChange={(e) => handleFileInputChange(record._id, e)}
    >
      <Upload name="logo" listType="picture">
        <Button icon={<UploadOutlined />}>Click to upload</Button>
      </Upload>
    </Form.Item>
       
      </Modal>

    </div>
  );
};

export default UploadAssignment;