import React from "react";
import { useNavigate } from "react-router-dom";
import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import { accordions } from "../../Data";
import Accordion from "./Accordion";
const Teacher = () => {
  const navigate=useNavigate();
  const handleTeachClick = () => {
    
    navigate("/InstructorDasboard");
  };
  return (
    <div className="section" id="teacher">
      <div className="grid sm:grid-cols-2 place-items-center gap-8">
        <div className="pl-5">
          <div className="font-bold sm:text-[1.875rem] text-[1.5rem] mb-5">
            Become <span className="text-Teal">An Instructor</span> <br /> of
            Our Platform
          </div>
          <p className="text-sm leading-7 text-gray mb-5">
          Elevate your career by stepping into the role of a teacher. Delve
          into the realm of education where you'll find unparalleled
            opportunities for personal growth and fulfillment. Inspire minds,
            ignite curiosity, and leave a lasting impact on the world as you
            shape the leaders of tomorrow.
          </p>
          <button   onClick={handleTeachClick} className="px-6 py-3 mr-4 text-white bg-Teal  text-sm  font-semibold px-6 py-3 mt-4">
            Start Teaching
          </button>
        </div>
        <div className="p-4 md:w-3/4 sm:row-start-1">
          <img src={teacher1} alt="" />
        </div>
        <div className="pl-5">
          <div className="font-bold sm:text-[1.875rem] text-[1.5rem] mb-5">
            Become <span className="text-Teal">An Instructor</span> <br /> of
            Our Platform
          </div>
          <p className="text-sm leading-7 text-gray mb-5">
          As a teacher, you'll play a pivotal role in nurturing the next
            generation, guiding them to develop essential skills, embrace
            challenges, and realize their full potential. Through your
            dedication and passion, you'll instill in students a love for
            learning, a thirst for knowledge, and the confidence to navigate the
            complexities of the world with resilience and compassion.
          </p>
          {/* <button className="py-3 px-4 bg-Teal text-white rounded-lg text-sm font-bold ">
            Get Started
          </button> */}
        </div>
        <div className="p-4 md:w-3/4">
          <img src={teacher2} alt="" />
        </div>
      </div>
      <div className="text-center my-8 font-bold sm:text-[1.875rem] text-[1.5rem]">
        Frequently <span className="text-Teal">Asked Questions</span>
      </div>
      <div className="mt-12 max-w-[700px] mx-auto">
        {accordions.map((accordion) => {
          return <Accordion key={accordion.id} {...accordion} />;
        })}
      </div>
    </div>
  );
};

export default Teacher;