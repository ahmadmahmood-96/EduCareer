import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Table, Tooltip, Typography, message, Tag } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userId= localStorage.getItem("token")
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [orders]);

  const columns = [
    {
      key: 1,
      title: "Order ID",
      dataIndex: "_id",
      width:350,

    },
    {
      key: 2,
      title: "Total Amount",
      dataIndex: "subtotal",
      width:350,
    },
    {
      key: 3,
      title: "Status",
      dataIndex: "payment_status",
      width:350,
    },

    {
      key: 4,
      title: "Courses",
      width:350,
      render: (_, record) => {
        if (record.summary) {
          return record.summary;
        } else {
          const courseNames = record.courses.map(course => course.title).join(', ');
          return courseNames || "N/A";
        }
      },
    },

   

  ];

  return (
    <div className='min-w-100'>
      <Typography.Title level={2}>Orders</Typography.Title>
      <Table columns={columns} dataSource={orders} />
      </div>
  );
};

export default Orders;
