import { useState, useEffect } from "react";
import { Statistic, Typography, Card, Row, Col, message } from "antd";
import CountUp from "react-countup";
import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

const formatter = (value) => <CountUp end={value} separator="," />;

export default function Dashboard() {
  const [totalNumberofUsers, setTotalNumberofUsers] = useState(0);
  const [totalNumberofInstructors, setTotalNumberofInstructor] = useState(0);
  const [totalNumberofStudents, setTotalNumberofStudents] = useState(0);
  const [totalNumberofFreeCourses, setTotalNumberofFreeCourses] = useState(0);
  const [totalNumberofPaidCourses, setTotalNumberofPaidCourses] = useState(0);
  const [totalNumberOfEnrollementsInPaidCourses, setTotalNumberOfEnrollementsInPaidCourses] = useState(0);
  const [totalNumberOfEnrollementsInFreeCourses, setTotalNumberOfEnrollementsInFreeCourses] = useState(0);
  const [totalNumberofPurchases, setTotalNumberofPurchases] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/totalUsers', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberofUsers(response.data.totalUsers);
      })
      .catch((error) => {
        message.error("Error fetching total users:", error);
      });

    axios
      .get(`http://localhost:8080/api/totalNumberOfInstructors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberofInstructor(response.data.totalNumberOfInstructors);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`http://localhost:8080/api/totalNumberOfStudents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberofStudents(response.data.totalNumberOfStudents);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`http://localhost:8080/api/totalNumberOfFreeCourses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberofFreeCourses(response.data.totalNumberOfFreeCourses);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`http://localhost:8080/api/totalNumberOfPaidCourses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberofPaidCourses(response.data.totalNumberOfPaidCourses);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    axios
      .get(`http://localhost:8080/api/totalNumberOfEnrollementsInPaidCourses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberOfEnrollementsInPaidCourses(response.data.totalNumberOfEnrollementsInPaidCourses);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

      axios
      .get(`http://localhost:8080/api/totalNumberOfEnrollementsInFreeCourses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setTotalNumberOfEnrollementsInFreeCourses(response.data.totalNumberOfEnrollementsInFreeCourses);
      })
      .catch((error) => {
        message.error("Error fetching records:", error);
      });

    // axios
    //   .get(`${baseUrl}admin/total-delivered-orders`, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    //   })
    //   .then((response) => {
    //     setTotalNumberofPurchases(response.data.totalDeliveredOrders);
    //   })
    //   .catch((error) => {
    //     message.error("Error fetching records:", error);
    //   });
  }, []);
  return (
    <>
      <Typography.Title level={2}>Dashboard</Typography.Title>
      <Row gutter={[16, 16]} wrap>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Total Number of Users"
              value={totalNumberofUsers}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Instructors"
              value={totalNumberofInstructors}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Students"
              value={totalNumberofStudents}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Free Courses"
              value={totalNumberofFreeCourses}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Paid Courses"
              value={totalNumberofPaidCourses}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Enrollements in Paid Courses"
              value={totalNumberOfEnrollementsInPaidCourses}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Enrollements in Free Courses"
              value={totalNumberOfEnrollementsInFreeCourses}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col>
        {/* <Col span={6} xxl={6} xl={6} lg={6} md={6} sm={12} xs={24}>
          <Card bordered={false}>
            <Statistic
              title="Number of Purchases"
              value={totalNumberofPurchases}
              valueStyle={styles}
              formatter={formatter}
            />
          </Card>
        </Col> */}
      </Row>
    </>
  );
}

const styles = {
  color: "#50ab00",
  fontSize: 30,
};
