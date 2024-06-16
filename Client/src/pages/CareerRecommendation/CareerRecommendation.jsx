import React, { useState } from "react";
import Topbar from "../../components/Navbar/NavbarPage";

export default function CareerRecommendation() {
  // State variables to manage the selected values
  const [database, setDatabase] = useState("");
  const [computerArchitecture, setComputerArchitecture] = useState("");
  const [distributedComputing, setDistributedComputing] = useState("");
  const [cyberSecurity, setCyberSecurity] = useState("");
  const [networking, setNetworking] = useState("");
  const [development, setDevelopment] = useState("");
  const [programmingSkills, setProgrammingSkills] = useState("");
  const [projectManagement, setProjectManagement] = useState("");
  const [computerForensics, setComputerForensics] = useState("");
  const [technicalCommunication, setTechnicalCommunication] = useState("");
  const [aiMl, setAiMl] = useState("");
  const [softwareEngineering, setSoftwareEngineering] = useState("");
  const [businessAnalysis, setBusinessAnalysis] = useState("");
  const [communicationSkills, setCommunicationSkills] = useState("");
  const [dataScience, setDataScience] = useState("");
  const [troubleshootingSkills, setTroubleshootingSkills] = useState("");
  const [graphicsDesigning, setGraphicsDesigning] = useState("");
  const [prediction, setPrediction] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //  const container = {
  //     hidden: {
  //       opacity: 0,
  //       scale: 0,
  //     },
  //     visible: {
  //       opacity: 1,
  //       scale: 1,
  //       transition: {
  //         delayChildren: 0.3,
  //         staggerChildren: 0.2,
  //       },
  //     },
  //   };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handlePredition = async (e) => {
    e.preventDefault();
    // Concatenate all state values
    const formData = {
      "Database Fundamentals": database,
      "Computer Architecture": computerArchitecture,
      "Distributed Computing Systems": distributedComputing,
      "Cyber Security": cyberSecurity,
      Networking: networking,
      "Software Development": development,
      "Programming Skills": programmingSkills,
      "Project Management": projectManagement,
      "Computer Forensics Fundamentals": computerForensics,
      "Technical Communication": technicalCommunication,
      "AI ML": aiMl,
      "Software Engineering": softwareEngineering,
      "Business Analysis": businessAnalysis,
      "Communication skills": communicationSkills,
      "Data Science": dataScience,
      "Troubleshooting skills": troubleshootingSkills,
      "Graphics Designing": graphicsDesigning,
    };

    try {
      const response = await fetch("http://10.113.70.214:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to the server");
      }

      const responseData = await response.json();
      console.log(responseData);
      const { prediction } = responseData;
      setPrediction(prediction);

      // Log the response from the server
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <Topbar />
      <div className="max-w-4xl mx-auto pr-16 pl-16 mt-8 bg-offWhite p-4 mb-8 rounded shadow-lg">
        <div className="text-Teal text-3xl mb-8 flex justify-center">
          Career Recommendation
        </div>
        <form>
          <div className="mb-4 flex justify-between">
            <label
              htmlFor="database"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Database Fundamentals:
            </label>
            <select
              id="database"
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              className="flex justify-end w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="computerArchitecture"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Computer Architecture:
            </label>
            <select
              id="computerArchitecture"
              value={computerArchitecture}
              onChange={(e) => setComputerArchitecture(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="distributedComputing"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Distributed Computing Systems:
            </label>
            <select
              id="distributedComputing"
              value={distributedComputing}
              onChange={(e) => setDistributedComputing(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="cyberSecurity"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Cyber Security:
            </label>
            <select
              id="cyberSecurity"
              value={cyberSecurity}
              onChange={(e) => setCyberSecurity(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="networking"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Networking:
            </label>
            <select
              id="networking"
              value={networking}
              onChange={(e) => setNetworking(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="development"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Development:
            </label>
            <select
              id="development"
              value={development}
              onChange={(e) => setDevelopment(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="programmingSkills"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Programming Skills:
            </label>
            <select
              id="programmingSkills"
              value={programmingSkills}
              onChange={(e) => setProgrammingSkills(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="projectManagement"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Project Management:
            </label>
            <select
              id="projectManagement"
              value={projectManagement}
              onChange={(e) => setProjectManagement(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="computerForensics"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Computer Forensics Fundamentals:
            </label>
            <select
              id="computerForensics"
              value={computerForensics}
              onChange={(e) => setComputerForensics(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="technicalCommunication"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Technical Communication:
            </label>
            <select
              id="technicalCommunication"
              value={technicalCommunication}
              onChange={(e) => setTechnicalCommunication(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="aiMl"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              AI ML:
            </label>
            <select
              id="aiMl"
              value={aiMl}
              onChange={(e) => setAiMl(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="softwareEngineering"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Software Engineering:
            </label>
            <select
              id="softwareEngineering"
              value={softwareEngineering}
              onChange={(e) => setSoftwareEngineering(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="businessAnalysis"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Business Analysis:
            </label>
            <select
              id="businessAnalysis"
              value={businessAnalysis}
              onChange={(e) => setBusinessAnalysis(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="communicationSkills"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Communication skills:
            </label>
            <select
              id="communicationSkills"
              value={communicationSkills}
              onChange={(e) => setCommunicationSkills(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="dataScience"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Data Science:
            </label>
            <select
              id="dataScience"
              value={dataScience}
              onChange={(e) => setDataScience(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="troubleshootingSkills"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Troubleshooting skills:
            </label>
            <select
              id="troubleshootingSkills"
              value={troubleshootingSkills}
              onChange={(e) => setTroubleshootingSkills(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          <div className="mb-4 flex justify-between">
            <label
              htmlFor="graphicsDesigning"
              className="w-60 text-gray-600 font-semibold mr-4"
            >
              Graphics Designing:
            </label>
            <select
              id="graphicsDesigning"
              value={graphicsDesigning}
              onChange={(e) => setGraphicsDesigning(e.target.value)}
              className="w-1/2 p-2 border"
            >
              <option value="">Select...</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Poor">Poor</option>
              <option value="Beginner">Beginner</option>
              <option value="Average">Average</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Excellent">Excellent</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div className="justify-center">
            <button
              className="bg-Teal hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handlePredition}
            >
              Discover yourself
            </button>
            <div>
              <div className="border p-5 mt-5">
                <div className="m-2">
                  Careers that align with your interests and skills are:
                </div>
                <div className="bg-offwhite p-2 text-2xl justify-center">
                  {prediction.map((item, index) => (
                    <ul key={index} className="">
                      {item}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
