import React, { useState, useEffect } from "react";
import axios from "axios";

const DisseminateQuiz = ({ courseId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/quizzes/course/${courseId}`)
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, [courseId]);

  const handleDisseminateClick = (quizId, title) => {
    setSelectedQuiz({ id: quizId, title: title });
    console.log(title);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        courseId: courseId,
        quizId: selectedQuiz.id,
        title: selectedQuiz.title,
        date,
        startTime,
        endTime,
      };
      // Send data to the backend server
      await axios.post("http://localhost:8080/api/disseminate", formData);
      // Reset form fields
      setDate("");
      setStartTime("");
      setEndTime("");
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="mt-4 bg-white">
      <h2 className="text-2xl font-bold mb-2">Disseminate Quiz</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Quiz Title</th>
              <th className="py-2 px-4 border-b">Disseminate Quiz Option</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="py-2 px-4 border-b">{quiz.title}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-teal-700 text-white py-1 px-2 rounded mr-2"
                    onClick={() => handleDisseminateClick(quiz._id, quiz.title)}
                  >
                    Disseminate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="mt-10 bg-white">
          <h3 className="text-xl font-bold mb-2">Dissemination Form</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="date" className="block mb-1">
                Date:
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-1 "
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startTime" className="block mb-1">
                Start Time:
              </label>
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-1 "
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endTime" className="block mb-1">
                End Time:
              </label>
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border p-1 "
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-Teal text-white mt-2 mx-3 px-4 py-2  hover:bg-teal-600 focus:outline-non"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white mt-2 mx-3 px-4 py-2  hover:bg-red-600 focus:outline-non "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DisseminateQuiz;
