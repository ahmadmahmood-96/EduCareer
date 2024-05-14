import React, { useState, useEffect } from "react";
import { Modal,Form,Table, Button, Tooltip, Typography, Input, Tag, message } from "antd";
import { WechatOutlined ,FileOutlined } from "@ant-design/icons";
import axios from "axios";

export default function SupportDetails() {
  const { TextArea } = Input;
  const [data, setData] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    const getSupport = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/support-detail`);
        const supportData = response.data.map((item) => {
          const { supportDetail, userDetail } = item;
          const updatedSupportDetail = {
            ...supportDetail,
            ...userDetail,
            responseSent: supportDetail.response ? true : false
          };
          return updatedSupportDetail;
        });
        setData(supportData);
      } catch (error) {
        console.error("Error fetching support details:", error);
      }
    };
  
    getSupport();
  }, []);
  const showFile = async (fileName) => {
    try {
      window.open(`http://localhost:8080/api/files/${fileName}`, "_blank");
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  

  const onResponse = (record) => {
    setModalVisible(true);
    setSelectedQueryId(record._id);
    console.log("Query Id is ",selectedQueryId);
  };
  const handleResponseSubmit = async () => {
    try {
      if (!responseText.trim()) {
        // Display toast message if response text is empty
        message.error('Response cannot be empty');
        return;
      }
      // Make an API call to send the response
      await axios.post(`http://localhost:8080/api/support/${selectedQueryId}/response`, {
        response: responseText,
      });
      // Close the modal after successful submission
      setModalVisible(false);
      setResponseText("");
      const updatedData = data.map(record => {
        if (record._id === selectedQueryId) {
          return { ...record, responseSent: true };
        }
        return record;
      });
      message.success('Response sent successfully');
      setData(updatedData);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

 
  const columns = [
    {
      key: 1,
      title: "User's Name",
      dataIndex: "name",
    },
   
      {
        key: 2,
        title: "Role",
        dataIndex: "accountType",
        render: (role) => {
          const roleMap = {
            Student: "student",
            Instructor: "instructor",
          };
          return roleMap[role] || role;
        },
        filters: [
          { text: "Student", value: "student" },
          { text: "Instructor", value: "instructor" },
        ],
        onFilter: (value, record) => record.accountType === value,
      },
     
    
    
    {
      key: 3,
      title: "Subject",
      dataIndex: "subject",
    },
    {
      key: 4,
      title: "Description",
      dataIndex: "description",
    },
    {
      key: 5,
      title: "Attachments",
      // dataIndex: "attachment",
      render: (record) => {
        return record.attachment ? (
          <Tooltip title="Click to see the file">
            <FileOutlined 
              onClick={() => showFile(record.attachment)} // Pass record.attachment instead of data.file
              style={{
                fontSize: 20,
                
                cursor: "pointer",
              }}
            />
          </Tooltip>
        ) : ("----");
      },
    },
    
    {
      key: 6,
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
    {
      key: 7,
      title: "Status",
      dataIndex: "responseSent",
      render: (responseSent) => (
        <Tag color={responseSent ? "green" : "orange"} style={{ fontSize: 14 }}>
          {responseSent ? "Sent" : "Pending"}
        </Tag>
      ),
      filters: [
        { text: " Sent", value: true },
        { text: " Pending", value: false },
      ],
      onFilter: (value, record) => record.responseSent === value,
    }
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
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleResponseSubmit}>Submit</Button>,
        ]}
      >
        {/* Modal content */}
        < Form  name="basic"
    labelCol={{ span: 4 }}
    wrapperCol={{ span: 20 }}
    style={{ maxWidth: 600, display: "outline-block"}}>
       <Form.Item label="Response"
        rules={[{ required: true, message: 'Please input your description!' }]}
        >
         <TextArea rows={4} value={responseText} onChange={(e) => setResponseText(e.target.value)} />
        </Form.Item>

        </Form>
      </Modal>
    </>
  );
}
