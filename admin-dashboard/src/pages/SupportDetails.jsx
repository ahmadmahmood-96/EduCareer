import React, { useState, useEffect } from "react";
import { Modal,Form,Table, Button, Tooltip, Typography, Input, Tag } from "antd";
import { WechatOutlined } from "@ant-design/icons";
import axios from "axios";

export default function SupportDetails() {
  const { TextArea } = Input;
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const getSupport = async () => {
      try {
        axios.get(`http://localhost:8080/api/support-detail`).then((response) => {
          // Extracting support and user details from the response
          const supportData = response.data.map((item) => ({
            ...item.supportDetail,
            ...item.userDetail,
          }));
          setData(supportData);
        });
      } catch (error) {
        console.error("Error fetching support details:", error);
      }
    };

    getSupport();
  }, []);

  const onResponse = (record) => {
    setModalVisible(true);
  };

  const columns = [
    {
      key: 1,
      title: "User's Name",
      dataIndex: "name",
    },
    {
      key: 2,
      title: "Email",
      dataIndex: "email",
    },
    {
      key: 3,
      title: "Role",
      dataIndex: "accountType",
      render: (role) => {
        const roleMap = {
          Student: "Student",
          Teacher: "Teacher",
        };
        return roleMap[role] || role;
      },
      filters: [
        { text: "Student", value: "Student" },
        { text: "Teacher", value: "Teacher" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      key: 4,
      title: "Subject",
      dataIndex: "subject",
    },
    {
      key: 5,
      title: "Description",
      dataIndex: "description",
    },
    {
      key: 6,
      title: "Attachments",
      dataIndex: "attachment",
    },
    {
      key: 7,
      title: "Response",
      render: (record) => {
        return (
          <Tooltip title="Click to send the response">
            <WechatOutlined
              onClick={() => onResponse(record)}
              style={{
                fontSize: 20,
                marginLeft: 10,
                cursor: "pointer",
              }}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <Typography.Title level={2}>Support Section</Typography.Title>
      <Table columns={columns} dataSource={data} />
      {/* Modal component */}
      <Modal
        title="Send Response"
        visible={modalVisible} // Set visibility based on state
        onCancel={() => setModalVisible(false)} // Close modal when canceled
        footer={null}
      >
        {/* Modal content */}
        < Form  name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600, display: "outline-block" }}>
       <Form.Item label="Response"
        rules={[{ required: true, message: 'Please input your description!' }]}
        >
          <TextArea column={4} />
        </Form.Item>

      <Button type="primary" htmlType="submit" >
        Submit
      </Button>

        </Form>
      </Modal>
    </>
  );
}
