import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserDetails from "../pages/UserDetails";
import OrderDetails from "../pages/OrderDetails";
import PageNotFound from "../pages/PageNotFound";
import SupportDetails from "../pages/SupportDetails";
import CourseDetails from "../pages/CourseDetails"


const HomeRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" index element={<Dashboard />} />
        <Route path="user-details" element={<UserDetails />} />
        <Route path="order-details" element={<OrderDetails />} />
        <Route path="support-section" element={<SupportDetails />} />
        <Route path="course-details" element={<CourseDetails />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;
