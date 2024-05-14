import React, { useState, useEffect } from "react";
import { Table, Typography, Tag } from "antd";
import axios from "axios";

export default function OrderDetails() {
  const [orders, setOrders] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/allOrders', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

 

  const columns = [
    {
      key: 1,
      title: "Name",
      render: (_, record) => {
        if(record.userName){
          return record.userName;
        }
        else{
          return "N/A";
        }

        
      },
    },
    {
      key: 2,
      title: "Email",
      render: (_, record) => {
        if(record.userEmail){
          return record.userEmail;
        }
        else{
          return "N/A";
        }
      },
    },
    // {
    //   key: 3,
    //   title: "Order ID",
    //   render: (_, record) => {
    //     if (record._id) {
    //       return record._id;
    //     } else {
    //       return "N/A";
    //     }
    //   },
    // },
    {
      key: 4,
      title: "Summary",
      render: (_, record) => {
        if (record.courseNames) {
          return record.courseNames;
        } else {
          return "N/A";
        }
      },
    },
    {
      key: 5,
      title: "Total Price",
      dataIndex: "subtotal",
      sorter: (a, b) => a.subtotal- b.subtotal,
    },
    {
      key: 6,
      title: "Order Placed Date",
      dataIndex: "orderDate",
      render: (orderDate) => {
        const date = new Date(orderDate);
        return date.toLocaleString(); // Convert date to a human-readable format
      },
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },

    // {
    //   key: 7,
    //   title: "Status",
    //   dataIndex: "payment_status",
    //   // filters: [
    //   //   { text: "Order Placed", value: "Order Placed" },
    //   //   { text: "Order Dispatched", value: "Order Dispatched" },
    //   //   { text: "Order Delivered", value: "Order Delivered" },
    //   // ],
    //   // onFilter: (value, record) => record.status === value,
    //   // render: renderStatusTag,
    // },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };

  return (
    <>
      <Typography.Title level={2}>Order Details</Typography.Title>
      <Table
        columns={columns}
        dataSource={orders}
        onChange={handleTableChange}
        {...{ sortedInfo }}
      />
    </>
  );
}
