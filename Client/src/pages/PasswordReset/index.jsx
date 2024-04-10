import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PasswordReset = () => {
	const [validUrl, setValidUrl] = useState(false);
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const param = useParams();
	const url = `http://localhost:8080/api/password-reset/${param.id}/${param.token}`;

	useEffect(() => {
		const verifyUrl = async () => {
			try {
				await axios.get(url);
				setValidUrl(true);
			} catch (error) {
				setValidUrl(false);
			}
		};
		verifyUrl();
	}, [param, url]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { data } = await axios.post(url, { password });
			setMsg(data.message);
			setError("");
			window.location = "/login"; 
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
		<Fragment>
			{validUrl ? (
				<div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-black bg-opacity-50">
					<form className="w-96 p-8 bg-white rounded shadow-md" onSubmit={handleSubmit}>
					<span className="text-lg font-bold">Set New Password</span>
                    <hr className="border-b border-gray-300 mb-4" />
						<input
							type="password"
							placeholder="Enter new password"
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
							className="w-full p-2 mb-4 border border-gray-300 rounded"
						/>

						<button type="submit" className="px-6 py-3 w-full font-bold text-white bg-Teal rounded-lg mr-4 text-sm">
							Submit
						</button>

						{error && <div className="p-2 mt-4 bg-red-500 text-white rounded">{error}</div>}
						{msg && <div className="p-2 mt-4 bg-green-500 text-white rounded">{msg}</div>}
					</form>
				</div>
			) : (
				<h1 className="text-center text-2xl mt-8">404 Not Found</h1>
			)}
		</Fragment>
	);
};

export default PasswordReset;
