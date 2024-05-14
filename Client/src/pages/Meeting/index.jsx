import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, DatePicker, message,Typography } from "antd";

const { TextArea } = Input;

const Meeting = ({ courseId }) => {
  const [form] = Form.useForm(); // Initialize form instance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Define isValidUrl function within the component
  const isValidUrl = (url) => {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (values) => {
    const { meetingLink, timing, date } = values;

    const currentDate = new Date();
    const selectedDateTime = new Date(`${date.format('YYYY-MM-DD')}T${timing}`);

    if (selectedDateTime <= currentDate) {
      setError("Meeting date and time cannot be in the past.");
      return;
    }

    if (!meetingLink || !timing || !date) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidUrl(meetingLink)) {
      setError("Invalid URL format");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/api/schedule-meeting", {
        courseId,
        meetingLink,
        timing,
        date: date.format('YYYY-MM-DD'),
      });
      message.success("Meeting scheduled and email sent successfully!");
      form.resetFields();
    } catch (error) {
      setError("An error occurred while scheduling the meeting.");
    }

    setLoading(false);
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: 800 }}>
    <div className="flex bg-white justify-center">
      <div className="w-1/2 container mx-auto px-4 py-8">
      <Typography.Title level={2}>Schedule Meeting </Typography.Title>
        {error && <p className="text-red-500">{error}</p>}
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Meeting Link"
            name="meetingLink"
            rules={[
              { required: true, message: "Please enter the meeting link" },
              {
                validator: (_, value) =>
                  isValidUrl(value)
                    ? Promise.resolve()
                    : Promise.reject("Invalid URL format"),
              },
            ]}
          >
            <Input placeholder="Enter Meeting Link" />
          </Form.Item>

          <Form.Item
            label="Timing"
            name="timing"
            rules={[{ required: true, message: "Please select the timing" }]}
          >
            <Input type="time" />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {loading ? "Loading..." : "Schedule Meeting"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Meeting;
