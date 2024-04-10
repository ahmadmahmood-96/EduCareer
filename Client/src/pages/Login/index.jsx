import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginModal = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    accountType: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/auth";

       if (!state.email || !state.password || !state.accountType) {
        setError("Please enter email, password, and select an account type.");
        return;
      }

  
     const { data: res } = await axios.post(url, state);
      localStorage.setItem("token", res.data.userId);
      localStorage.setItem("account type", res.data.accountType);
      window.dispatchEvent(new Event('storageChange'));
      console.log(res.data);
      navigate("/home");

      // if (res.data.accountType === "student") {
      //   navigate("/discover");
      // } else if (res.data.accountType === "instructor") {
      //   navigate("/InstructorDasboard");
      // } 

    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
      <div className="w-96 p-8 rounded bg-white shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Log in to your EduCareer account</span>
          
        </div>
        <hr className="border-b border-gray-300 mb-4" />
        <div className="p-4">
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            name="email"
            value={state.email}
            onChange={changeHandler}
          />
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={state.password}
            onChange={changeHandler}
          />

          <div style={{ alignSelf: "flex-start", margin: '5px', marginLeft: '17px'  }}>
              <label>Log in as: </label>
              <label style={{ margin: '5px' }}>
                <input
                  type="radio"
                  name="accountType"
                  value="student"
                  checked={state.accountType === "student"}
                  onChange={changeHandler}
                  className="mt-5"
                />
                Student
              </label>
              <label style={{ margin: '5px' }}>
                <input
                  type="radio"
                  name="accountType"
                  value="instructor"
                  checked={state.accountType === "instructor"}
                  onChange={changeHandler}
                  className="mt-5"
                />
                Instructor
              </label>
            </div>

          {error && (
            <div className="p-2 mb-4 bg-red-500 text-white rounded">
              {error}
            </div>
          )}

          <button
            className="px-6 py-3 w-full font-bold text-white bg-Teal rounded-lg mr-4 text-sm"
            onClick={submitHandler}
          >
            Login
          </button>

          <div className="mt-4">
            <span className="text-sm">
              Don't have an account?
              <Link to="/signup" className="text-Teal">
                <b>Sign up</b>
              </Link>
            </span>

            <Link to="/forgot-password" className="text-Teal">
              <p >Forgot Password?</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
