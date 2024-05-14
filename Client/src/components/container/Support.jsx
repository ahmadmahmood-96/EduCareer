import React, { useState, useEffect } from "react";
import axios from 'axios';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FolderViewOutlined } from "@ant-design/icons";
// import { Tooltip } from "antd";

const Support = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [hasRecords, setHasRecords] = useState(false); // State to track if user has records
  const container = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  useEffect(() => {
    // Fetch data related to the user from the database
    const fetchData = async () => {
      const userToken = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:8080/api/support-details/${userToken}`);
        // Check if there are records for the user
        setHasRecords(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchData();
  }, []);

  const ViewAdminResponse = () => {
    console.log("demoooo ddemoooooooooo");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const submitData = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token");
    const formData = {
      subject,
      description,
      file
    };
    const headers = {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "multipart/form-data",
    };
    try {
      const result = await axios.post(`http://localhost:8080/api/support/${userToken}`, formData, { headers });
      toggleModal();
      toast.success("Support request submitted successfully!");
      console.log(result);
    } catch (error) {
      console.error("axios error:", error);
      toast.error("Failed to submit support request.");
    }
  };
   return (
    <div className="section" id="support">
      <div className="text-center relative">
        <div className="sm:text-3xl text-2xl font-bold mb-5">
          Help & <span className="text-Teal">Support</span>
        </div>
        <p className="text-sm text-gray leading-7 max-w-[700px] mx-auto">
          Explore our website's dedicated support system, designed to assist users, whether you're a teacher or a student.
          From resolving technical glitches to offering educational materials, we're committed to ensuring a seamless 
          and enriching experience for all our customers.
        </p>
        <button onClick={toggleModal} className="text-sm mt-5 text-white bg-Teal sm:p-3 p-2 shadow-md font-bold">
          Help Center
        </button>

        {isModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <div
              id="crud-modal"
              tabIndex="-1"
              aria-hidden="true"
              className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center h-screen w-full`}
            >
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Our Assistance.
                    </h3>
                    <button type="button" onClick={toggleModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>

                  <form className="p-4 md:p-5" onSubmit={submitData}>
                    <div className="grid gap-4 mb-4 grid-cols-1">
                      <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
                        <input type="text"
                          id="subject"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-primary-600
                          focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                           dark:text-white dark:focus:ring-primaryp-500 dark:focus:border-primary-500"
                          placeholder="Enter subject" onChange={(e) => setSubject(e.target.value)} required />
                      </div>
                      <div>
                        <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                        <textarea id="description" rows="4"
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border border-gray-300
                          focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                           dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} required></textarea>
                      </div>
                      <div>
                        <label htmlFor="attachment" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Attachment</label>
                        <input type="file" id="attachment" name="attachment" onChange={handleFileChange} className="bg-gray-50 border border-gray-300 text-gray-900 focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />

                      </div>
                      
                    </div>
                    <div className="flex items-center justify-between">
                      
                      {hasRecords &&
                        (
                       
                        <div>
                          <a href="/admin-response" className="text-teal-900 mt-10 dark:text-white pl-5 cursor-pointer">
                            Click to View admin's response
                          </a>
                        </div>
                      )}
                      <button type="submit" className="text-sm mt-5 text-white bg-Teal sm:p-3 p-2 shadow-md font-bold dark:focus:ring-Teal-800">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        <motion.div variants={container} initial="hidden" whileInView="visible" className="grid md:grid-cols-4 sm:grid-cols-2 mt-12 gap-8"></motion.div>
      </div>
      <ToastContainer /> {/* Toast Container for displaying notifications */}
    </div>
  );
};

export default Support;
