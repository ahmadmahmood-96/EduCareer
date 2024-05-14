import React from "react";
import banner from "../../assets/hero1.png";
import { useNavigate } from "react-router-dom";
import Button  from "../../customcomponents/Button"
import Modal  from "../../customcomponents/Modal"
import vector from "../../assets/vector.png";
import { FaRobot } from 'react-icons/fa';



const Home = () => {

  // const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const handleDiscoverClick = () => {
    // const user= localStorage.getItem('token');
  
    // if(!user){
    //   navigate("/login");
    // }
    // else{
    navigate("/discover");
    // }
  };

  return (
    <div  id="home" style={{
      backgroundImage: `url(${banner})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
    }}>
      <div className="md:flex  py-32 pt-16">

        <div className="pt-32 px-80 pl-32">
          {/* <div className="font-bold text-m text-black text-Teal mb-4">
            {" "}
            your e-learning partner
          </div> */}
          <div className="sm:text-[2.5rem] text-[1.825rem] font-bold text-white">
            Take the first step <br /> to learn with us
          </div>
          <p className="text-base leading-7 text-Solitude max-w-sm">
           "Empowering Minds, Transforming Futures – Elevate Your Learning Journey Today!"
          </p>
          <div className="flex">
            <button className="rounded p-2 mr-4 text-Gray bg-white   text-sm  font-semibold  mt-4"
              onClick={handleDiscoverClick}>
              Discover Courses
            </button>

            {/* Chatbot */}

            <a href="http://localhost:8081" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <span className='rounded p-2 mr-4 text-Gray bg-white text-sm font-semibold mt-4' style={{ display: "flex", alignItems: "center" }}>
                <FaRobot size="30" style={{ marginRight: "8px" }} />
                Career Bot
              </span>
            </a>
          
          </div>
          
        </div>
        <div className="md:w-[45%] py-32">
          <img src={vector} alt="" />
        </div>
      </div>

     
        
      

    </div>
  );
};

export default Home;
