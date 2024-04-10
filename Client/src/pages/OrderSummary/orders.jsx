import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div className="m-2">
      <div className="text-3xl">Your Orders</div>
      <table className="mt-5 min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-Teal text-white">
            <th className="py-2 px-4 border-b">Order ID</th>
            <th className="py-2 px-4 border-b">Total Amount</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Summary</th>
            {/* Add more table headers if needed */}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="py-2 px-4 border-b border-r">{order._id}</td>
              <td className="py-2 px-4 border-b border-r">Rs. {order.subtotal}</td>
              <td className="py-2 px-4 border-b border-r">{order.payment_status}</td>
              <td className="py-2 px-4 border-b border-r">
              <table>
                
                  <tbody>
                    {order.courses.map(course => (
                      <tr key={course.courseId}>
                        <td className='py-2 px-4'>{course.title}</td>
                        {/* <td>Price: Rs.{course.price}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
