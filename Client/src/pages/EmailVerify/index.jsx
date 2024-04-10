
import { Fragment } from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import success from "../../images/success.png";
import styles from "./styles.module.css";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(true);
	const param = useParams();


	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
				const { data:res } = await axios.get(url);
				
				console.log(res);
				
				
				setValidUrl(true);
				localStorage.setItem("account type", res.data.accountType);
				// localStorage.setItem("id", res.data.userId);


				
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);

	const accountType = localStorage.getItem("account type");

	return (
		<Fragment>
			{validUrl ? (
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<h1>Email verified successfully</h1>
					<Link to="/login">
						      <button className="bg-Teal text-white px-4 py-2  hover:bg-teal-600 focus:outline-none">Login</button>
				      </Link>

					{/* {
						accountType ==="student" ?
							(<Link to="/login">
						      <button className={styles.green_btn}>Login</button>
					        </Link>)
						
						: (<>
							<div>Before logging into your instructor account you must take this test</div>
							<Link to="/instructor-quiz">
						      <button className={styles.green_btn}>Take Quiz</button>
					        </Link> 
						</>)
						} */}
					
					
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
	);
};

export default EmailVerify;
