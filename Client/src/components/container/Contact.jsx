import React from "react";
import { motion } from "framer-motion";
const Contact = () => {
  return (
    <div className="section" id="contact">
      <div className="text-center max-w-[600px] mx-auto">
        {/* <div className="sm:text-3xl text-2xl font-bold mb-5">
          Subscribe Newsletter
        </div> */}
        {/* <p className="text-sm leading-7 text-gray">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum autem
          minus doloribus voluptatem illo velit quia eum aperiam! Repudiandae,
          tempore. Lorem ipsum dolor sit amet.
        </p> */}
        {/* <motion.form
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-5"
        >
          <input
            type="text"
            placeholder="Enter your email address"
            className="sm:p-3 p-2 outline-none text-sm shadow-md sm:w-72 w-60"
          />
          <button className="text-sm text-white bg-Teal sm:p-3 p-2 shadow-md font-bold">
            Subscribe
          </button>
        </motion.form> */}
      </div>
      <div className="text-center justify-center max-w-[600px] mx-auto">
        <div className="text-gray sm:text-3xl text-2xl font-bold mb-5">
          Contact Us
        </div>
        {/* <p className="text-sm leading-7 text-gray">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum autem
          minus doloribus voluptatem illo velit quia eum aperiam! Repudiandae,
          tempore. Lorem ipsum dolor sit amet.
        </p> */}
        <motion.form
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-5 mx-20 justify-center text-center item-center"
        >
          <p className="text-gray sm:p-3 p-2  text-center outline-none text-sm shadow-md sm:w-72 w-120 ml-20">
            Amna Noor : amnanooraslam@gmail.com
          </p>
          <p className="text-gray sm:p-3 p-2  text-center outline-none text-sm shadow-md sm:w-72 w-120 ml-20">
            Ayesha Qazi: qaziayesha966@gmail.com
          </p>

          {/* <button className="text-sm text-white bg-Teal sm:p-3 p-2 shadow-md font-bold">
            Subscribe
          </button> */}
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
