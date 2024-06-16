import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Modal,
  Table,
  Tooltip,
  Typography,
  message,
  Tag,
  Upload,
  Form,
  Button,
} from "antd";
import { UploadOutlined, FileOutlined } from "@ant-design/icons";
import { FileInput } from "lucide-react";
import { Input } from "@mui/material";

const SubmittedAssignments = () => {
  const { Id } = useParams();
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [grades, setGrades] = useState({});

  const handleGradeChange = (assignmentId, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [assignmentId]: value,
    }));
  };
  const handleGradeSubmission = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/submitted-assignments/grades`,
        { grades }
      );
      console.log(response.data);
      setModalVisible(false);
      message.success("Successfully submitted the Grades");
    } catch (error) {
      console.error("Error submitting grades:", error);
    }
  };

  const handleCheckPlagiarism = async () => {
    try {
      const formData = new FormData();
      //const filesWithPaths = [];
      let names = [];
      let files = [];

      submittedAssignments.forEach((assignment) => {
        names.push(assignment.fileName);
        files.push(assignment.subfile);
      });

      console.log(names);
      console.log(files);

      formData.append("files", files);
      formData.append("names", names);

      // Send data to backend for plagiarism check
      const response = await axios.post(
        "http://10.113.70.214:5000/uploader",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const showAssFiles = (file) => {
    console.log("File:", file);
    window.open(
      `http://localhost:8080/subfiles/${file}`,
      "_blank",
      "noreferrer"
    );
  };
  const onResponse = (assignmentId) => {
    console.log(assignmentId);
    setSelectedAssignmentId(assignmentId);
    console.log(selectedAssignmentId);
    setModalVisible(true);
  };

  const handleOpenModal = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setModalVisible(true);
  };
  const handleCancelModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchSubmittedAssignments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/submitted-assignments/${Id}`
        );

        setSubmittedAssignments(response.data);
        console.log(submittedAssignments);
      } catch (error) {
        console.error("Error fetching submitted assignments:", error);
      }
    };

    fetchSubmittedAssignments();
  }, [Id]);

  const columns = [
    {
      key: 1,
      title: "Submission Type",
      dataIndex: "submissionTime",
    },
    // {
    //   title: "Assignment Title",
    //   dataIndex: ["assignmentId", "title"],
    //   key: "assignmentTitle",

    //   render: (record) => (
    //     <span>{record.assignmentId.title}</span>
    //   ),
    // },
    {
      title: "Submitted By",
      dataIndex: ["userId", "firstName"],
      key: "submittedBy",
      render: (firstName, record) => (
        <span>{`${firstName} ${record.userId.lastName}`}</span>
      ),
    },

    {
      title: "Submission File",
      dataIndex: "subfile",
      key: "submissionFile",
      render: (subfile) => (
        <Tooltip title="View File">
          <Button
            type="link"
            icon={<FileOutlined />}
            onClick={() => showAssFiles(subfile)}
          />
        </Tooltip>
      ),
    },
    {
      title: "Grade",
      dataIndex: "_id",
      key: "grade",
      render: (record) => (
        <Tooltip title="Add Grade">
          <Button
            icon={<FileOutlined />}
            onClick={() => handleOpenModal(record)} // Open modal with assignment ID
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={2}>Submitted Assignment</Typography.Title>

      <div className="p-5 m-8">
        <button
          className="mt-2 px-4 py-2 bg-Teal text-white "
          onClick={handleCheckPlagiarism}
        >
          Check Plagiarism
        </button>

        {/* Table content */}
        <Table columns={columns} dataSource={submittedAssignments} />

        <Modal
          title="Enter Grade"
          visible={modalVisible}
          onCancel={handleCancelModal}
          footer={[
            <Button key="cancel" onClick={handleCancelModal}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleGradeSubmission}>
              Submit
            </Button>,
          ]}
        >
          <Form>
            <Form.Item label="Grade">
              <Input
                type="number"
                value={grades[selectedAssignmentId] || ""}
                onChange={(e) =>
                  handleGradeChange(selectedAssignmentId, e.target.value)
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default SubmittedAssignments;
