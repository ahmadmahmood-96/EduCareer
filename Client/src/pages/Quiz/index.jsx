import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Quiz = ({ courseId }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [questions, setQuestions] = useState([]); // State to store questions
  const [correctIndex, setCorrectIndex] = useState(null);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [title, setTitle] = useState("");

  const handleCorrectAnswerChange = (index, optionIndex) => {
    setCorrectIndex(index);
    setCorrectOptionIndex(optionIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true); // Set loading state to true

      const formData = new FormData();

      // Append file to FormData
      formData.append("file", file);

      // Send the formData to Flask backend
      const response = await axios.post(
        "http://192.168.0.107:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      // Convert the object into an array of questions
      const questionsArray = Object.values(response.data);

      // Update state with questions received from the backend
      setQuestions(questionsArray);
    } catch (e) {
      console.error(e.response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index, field, optionIndex) => {
    const updatedQuestions = [...questions];
    if (field === "wrong_options") {
      updatedQuestions[index][field][optionIndex] = e.target.value;
    } else if (field === "correct_answer") {
      updatedQuestions[index][field] = e.target.value;
    } else if (field === "question_text") {
      updatedQuestions[index][field] = e.target.value;
    }
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleSubmission = async () => {
    try {
      setIsLoading(true);

      // Get userId from localStorage
      const userId = localStorage.getItem("token");

      // Prepare data to send to the backend
      const data = {
        userId,
        title,
        questions: questions.map((question, index) => ({
          questionText: question.question_text, // Make sure property names match
          correctAnswer: question.correct_answer, // Make sure property names match
          wrongOptions: question.wrong_options,
          questionNumber: `Q${index + 1}`, // Add question number dynamically
        })),
      };

      // Send approved data to the backend
      const response = await axios.post(
        `http://localhost:8080/api/saveQuestions?courseId=${courseId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setQuestions([]);
      setTitle("");
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleChange = (e) => {
    if (e && e.target) {
      if (e.target.name === "file") {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log(
          "Selected File Name:",
          selectedFile ? selectedFile.name : null
        );
      }
    }
  };

  return (
    <div className="flex ">
      <div className="w-[50%] px-10 h-screen py-10">
        <h1 className="text-3xl font-bold mb-4 text-center">Quiz</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleTitleChange}
              className="mt-1 p-2 w-full border"
              placeholder="Enter quiz title"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Add file
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              className="mt-1 p-2 w-full border"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-non"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-[50%]">
        <div
          className="h-screen py-10 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{`Question ${index + 1}:`}</p>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-trash"
                  onClick={() => handleDeleteQuestion(index)}
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#ff2825"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </div>
              <input
                type="text"
                value={question.question_text}
                onChange={(e) => handleInputChange(e, index, "question_text")}
                className="mt-1 p-2 w-full border "
                placeholder="Enter question text"
              />
              <div>
                <p className="font-semibold">Correct Answer:</p>
                <input
                  type="text"
                  value={question.correct_answer}
                  onChange={(e) =>
                    handleInputChange(e, index, "correct_answer")
                  }
                  className="mt-1 p-2 w-full border  bg-green-100"
                  placeholder="Enter correct answer"
                />
              </div>
              <div>
                <p className="font-semibold">Wrong Options:</p>
                {question.wrong_options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleInputChange(e, index, "wrong_options", optionIndex)
                    }
                    className="mt-1 p-2 w-full border "
                    placeholder={`Enter wrong option ${optionIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {questions.length > 0 && (
          <div className="flex items-center justify-center mt-4">
            <button
              type="button"
              className="bg-Teal text-white mt-2 px-4 py-2  hover:bg-teal-600 focus:outline-non"
              onClick={handleSubmission}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
