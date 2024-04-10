import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, List, ListItem } from '@mui/material';
import CourseCard from '../../customcomponents/Card';

const CourseDisplay = () => {
  const [courses, setCourses] = useState([]);
  const [displayDashboard, setDisplayDashboard] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/displaycourses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => setCourses(result.data))
      .catch((err) => console.log(err));
  }, [token]);

  const handleDelete = (id) => {
    const confirmDeletion = window.confirm('Are you sure you want to delete this course?');

    if (confirmDeletion) {
      axios
        .delete(`http://localhost:8080/api/deletecourses/${id}`)
        .then(() => {
          setCourses(courses.filter((course) => course._id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCourseClick = (courseId, title) => {
    navigate(`/CourseDashboard`, { state: { title, courseId } });
  };

  const handleHover = (course) => {
    console.log(`Hovering over course: ${course.title}`);
  };

  useEffect(() => {
    setDisplayDashboard(location.pathname === '/');
  }, [location]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Created Courses
      </Typography>
      <div className="flex flex-wrap gap-4 md:w-full sm:w-[170%] xs:w-[340%] w-[300%]">
        {courses.map((course) => (
          <div key={course._id} style={{ flex: '1 1 20' }}>
            <CourseCard
              course={course}
              type="instructor"
              onEnroll={handleCourseClick}
              onHover={handleHover}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
      {courses.length === 0 && <Typography>No created courses</Typography>}
    </div>
  );
};

export default CourseDisplay;
