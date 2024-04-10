import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:8080/api/password-reset`;
            const { data } = await axios.post(url, { email });
            setMsg(data.message);
            setError("");
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                setMsg("");
            }
        }
    };

    return (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
            <form className="w-96 p-8 rounded bg-white shadow-md" onSubmit={handleSubmit}>
              
                <span className="text-lg font-bold">Reset Your Password</span>
                <hr className="border-b border-gray-300 mb-4" />
               
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                 
                <button type="submit" className="px-6 py-3 w-full font-bold text-white bg-Teal rounded-lg mr-4 text-sm">
                    Send Login Link
                </button>
              
               
                {error && <div className="mt-4 p-2 mb-4 bg-red-500 text-white rounded">{error}</div>}
                {msg && <div className="mt-4 p-2 mb-4 bg-green-500 text-white rounded">{msg}</div>}

            </form>
        </div>
    );
};

export default ForgotPassword;
