import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Button, Input, DatePicker, Space, Typography, TimePicker ,message} from "antd";

const DisseminateQuiz = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/quizzes/course/${courseId}`)
      .then((response) => {
        setQuizzes(response.data);
        console.log(quizzes);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, [courseId]);
  const handleDisseminateClick = (quizId, title) => {
    setSelectedQuiz({ id: quizId, title: title });
    setShowForm(true);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        courseId: courseId,
        quizId: selectedQuiz.id, // Access the id property directly
        title: selectedQuiz.title,
        date,
        startTime,
        endTime,
      };
      // Send data to the backend server
      await axios.post("http://localhost:8080/api/disseminate", formData);
      // Reset form fields
      setDate("");
      setStartTime("");
      setEndTime("");
      setShowForm(false);

      message.success("Quiz disseminated Successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  

  const handleCancel = () => {
    setShowForm(false);
  };
  const handleStartDateChange = (date, dateString) => {
    // Ensure selected date is not in the past
    if (moment(dateString).isBefore(moment().format("YYYY-MM-DD"))) {
      message.error("Start date cannot be in the past");
    } else {
      setDate(dateString);
    }
  };

  const handleEndDateChange = (date, dateString) => {
    // Ensure selected date is not in the past
    if (moment(dateString).isBefore(moment().format("YYYY-MM-DD"))) {
      message.error("End date cannot be in the past");
    } else {
      setDate(dateString);
    }
  };

  const columns = [
    {
      title: "Quiz Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Disseminate Quiz Option",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleDisseminateClick(record._id, record.title)}
        >
          Disseminate
        </Button>
      ),
    },
  ];

  return (
    <>
    <div style={{ margin: "0 auto", maxWidth: 800 }}>
    <Typography.Title level={2}>Disseminate Quiz</Typography.Title>
      <Table
        columns={columns}
        dataSource={quizzes}
        pagination={false}
        rowKey={(record) => record.id}
      />
     {showForm && (
        <div className="mt-10 bg-white">
          <h3 className="text-xl font-bold mb-2">Dissemination Form</h3>
          <form onSubmit={handleSubmit}>
            <Space direction="vertical" size={12}>
              <DatePicker
                onChange={handleStartDateChange}
                value={date ? moment(date, "YYYY-MM-DD") : null}
                format="YYYY-MM-DD"
              />
              <TimePicker
                placeholder="Start Time"
                value={startTime ? moment(startTime, "HH:mm") : null}
                onChange={(time, timeString) => setStartTime(timeString)}
              />
              <TimePicker
                placeholder="End Time"
                value={endTime ? moment(endTime, "HH:mm") : null}
                onChange={(time, timeString) => setEndTime(timeString)}
              />
              <div>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </div>
            </Space>
          </form>
        </div>
      )}
      </div>
    </>
  );
};

export default DisseminateQuiz;
