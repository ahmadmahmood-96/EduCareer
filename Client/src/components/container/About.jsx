import React from "react";
import about from "../../assets/About.jpg";

const About = () => {
  return (
    <div className="section" id="about">
      <div className="grid md:grid-cols-2 gap-8 place-items-center">
        <div className="border-[3px] border-solid border-Teal rounded-lg">
          <img src={about} alt="" className="p-4" />
        </div>
        <div>
          <div className="font-bold sm:text-[1.875rem] text-[1.5rem] mb-5">
            We provide the <br /> best{" "}
            <span className="text-Teal">online courses</span>
          </div>
          <p className="text-sm text-gray leading-7 mb-4">
          "Elevate Your Learning Experience with Our Premium Online Courses 
          – A Gateway to Excellence and Personal Growth. Discover a World of Possibilities, Guided by Expert Instructors, 
          and Ignite Your Passion for Lifelong Learning. Your Journey to Success Starts Here!"
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;