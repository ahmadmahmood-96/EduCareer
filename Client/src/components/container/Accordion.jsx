import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
const Accordion = ({ id, title }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const handleClick = (id) => {
    setActiveIndex(id === activeIndex ? null : id);
  };
  const answers = {
    1: "EduCareer is a cutting-edge online learning platform designed to meet the diverse needs of both learners and instructors. EduCareer revolutionizes the traditional learning experience by providing seamless navigation, interactive learning tools, and AI-driven career counseling. It aims to bridge the gap between education and career aspirations, empowering users to enhance their skills, advance their careers, and achieve their goals with confidence.",
    2: "EduCareer offers a diverse range of courses covering various fields such as software engineering, programming and development, networking, machine learning, database management, programming languages, and operating systems. Whether you're a beginner or an experienced professional, you can find courses tailored to your learning needs and career goals. Stay tuned for future updates as we continue to expand our course offerings to provide even more diverse and specialized categories to meet your educational needs. ",
    3: "Certainly! Aspiring instructors are welcome to join EduCareer. Upon expressing interest in teaching, individuals undergo a qualification process, including a proficiency quiz. Achieving a minimum score of 60% grants eligibility to become an instructor on our platform. This ensures our educators meet the high standards necessary to deliver quality education to our students. Join us and embark on a rewarding journey of teaching and learning with EduCareer.",
  };
  return (
    <div className="pb-8">
      <div className="flex items-center justify-between">
        <div className="sm:text-xl text-base font-bold">{title}</div>
        <BsChevronDown
          className={`${
            id === activeIndex ? "rotate-180" : "rotate-0"
          } cursor-pointer transition-all duration-300`}
          onClick={() => handleClick(id)}
        />
      </div>
      <AnimatePresence>
        {id === activeIndex && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
            className="pt-4"
          >
            <p className="text-sm leading-7 text-gray">{answers[id]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
