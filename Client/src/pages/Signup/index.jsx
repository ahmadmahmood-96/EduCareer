import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const SignupModal = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
		accountType: "", 
  });


  useEffect(() => {
		let timer;
		// If there's an error or success message, start a timer to clear it after 2 seconds
		if (error || msg) {
			timer = setTimeout(() => {
				setError('');
				setMsg('');
			}, 3000);
		}

		return () => clearTimeout(timer);
	}, [error, msg]);

  const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

  const changeHandler = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/users";
      const { data: res } = await axios.post(url, state);

      
      
      setMsg(res.message);
      console.log(res.data.accountType)
     
      console.log(res.data);
      
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
      <div className="w-96 p-8 rounded bg-white shadow-md">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Sign up and start learning</span>
        </div>
        <hr className="border-b border-gray-300 mb-4" />
        <div className="p-4">
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="First Name"
            name="firstName"
            value={state.firstName}
            onChange={changeHandler}
          />
          <input
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={state.lastName}
            onChange={changeHandler}
          />
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
            onChange={changeHandler}
            value={state.password}
            required
          />


						<label style={{ alignSelf: "flex-start" }}>
							<input
								type="checkbox"
								onChange={handleTogglePassword}
								checked={showPassword}
								style={{ margin: '5px' }}
							/>
							Show Password
						</label>

						<div>
							<label>Sign up as: </label>
							<label style={{ alignSelf: "flex-start" }}>
              <input
                type="radio"
                name="accountType"  
                value="student"
                checked={state.accountType === "student"}
                onChange={changeHandler}
                style={{ margin: '5px' }}
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
                style={{ margin: '5px' }}
              />
              Instructor
            </label>
              </div>

          {error && (
            <div className="p-2 mb-4 bg-red-500 text-white rounded">
              {error}
            </div>
          )}
          {msg && (
            <div className="p-2 mb-4 bg-green-500 text-white rounded">
              {msg}
            </div>
          )}

          <button
            className="mt-4 px-6 py-3 w-full font-bold text-white bg-Teal rounded-lg mr-4 text-sm"
            onClick={submitHandler}
          >
            Signup
          </button>

          <div className="mt-4">
            <span className="text-lg">Already have an account?</span>
            <Link to="/login" className="text-Teal font-bold ml-1">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;