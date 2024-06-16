import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";

const ViewGrades = () => {
    const [quizGrades, setQuizGrades] = useState([]);
    const [assignmentGrades, setAssignmentGrades] = useState([]);
    const [showQuizTable, setShowQuizTable] = useState(false); // State to track which table to show

    useEffect(() => {
        const userId = localStorage.getItem("token");
        const fetchGrades = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/assignment-grades/${userId}`);
                setAssignmentGrades(response.data);
            } catch (error) {
                console.error('Error fetching assignment grades:', error);
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/quiz-grades/${userId}`);
                setQuizGrades(response.data);
            } catch (error) {
                console.error('Error fetching quiz grades:', error);
            }
        };

        fetchGrades();
    }, []);

    const columns = [
        {
            key: 1,
            title: "Course Name",
            dataIndex: "courseName",
            width: 350,
        },
        {
            key: 2,
            title: "Assignment Title",
            dataIndex: "assignmentTitle",
            width: 350,
        },
        {
            key: 3,
            title: "Assignment File",
            dataIndex: "assFile",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<FileOutlined />}
                    onClick={() => window.open(`http://localhost:8080/files/${record.assFile}`, "_blank", "noreferrer")}
                >
                    Open File
                </Button>
            ),
            width: 350,
        },
        {
            key: 4,
            title: "Your Submission",
            dataIndex: "subfile",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<FileOutlined />}
                    onClick={() => window.open(`http://localhost:8080/subfiles/${record.subfile}`, "_blank", "noreferrer")}
                >
                    Open File
                </Button>
            ),
            width: 350,
        },
        {
            key: 5,
            title: "Submission Time",
            dataIndex: "submissionTime",
            render: (submissionTime) => {
                const formattedDate = new Date(submissionTime).toLocaleString();
                return <span>{formattedDate}</span>;
            },
            width: 350,
        },
        {
            key: 6,
            title: "Marks Obtained",
            dataIndex: "marks",
            width: 350,
        },
    ];

    const columns1 = [
        {
            key: 1,
            title: "Course Name",
            dataIndex: "courseName",
            width: 350,
        },
        {
            key: 2,
            title: "Quiz Title",
            dataIndex: "quizTitle",
            width: 350,
        },
        {
            key: 3,
            title: "Total Marks",
            dataIndex: "total",
            width: 350,
        },
        {
            key: 4,
            title: "Marks Obtained",
            dataIndex: "score",
            width: 350,
        },
    ];

    return (
        <div>
            <div className='min-w-100'>
            <Typography.Title level={2}>Grades</Typography.Title>
                <div>
                    <Button
                        onClick={() => setShowQuizTable(false)}
                    >
                        Assignment
                    </Button>
                    <Button
                        onClick={() => setShowQuizTable(true)}
                    >
                        Quiz
                    </Button>
                </div>

               
                {showQuizTable ? (
                    <Table columns={columns1} dataSource={quizGrades} />
                ) : (
                    <Table columns={columns} dataSource={assignmentGrades} />
                )}
            </div>
        </div>
    );
}

export default ViewGrades;
