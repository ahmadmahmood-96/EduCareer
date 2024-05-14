import { Route, Routes, Navigate } from "react-router-dom";
import React from 'react';
import  Home from "./pages/HomePage/HomePage";
import Discover from './pages/Discover';
import Signup from './pages/Signup';
import EmailVerify from "./pages/EmailVerify";
import Login from './pages/Login';
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import MyLearning from './pages/MyLearning/MyLearning'
import UploadAssignment from './pages/UploadAssignment/UploadAssignment'
import ProfileSettings from './pages/ProfileSettings/ProfileSettings'
import StudentDashboard from './pages/StudentDashboard/StudentDashboard'
import Assignment from './pages/Assignment/Upload'
import InstructorDasboard from './pages/InstructorDashboard/index'
import Course from './pages/Course/createcourse'
import Updatecourse from './pages/Course/updateCourse'
import DisplayCourse from './pages/Course/CourseDisplay'
import ModulePage from './pages/Module/AddModule'
import Coursemainpage from './pages/CourseDashboard/CourseDashboard'
import ViewCourseDetails from './pages/ViewCourseDetails/ViewCourseDetails'
import AccessCourseContent from './pages/AccessCourseContent/AccessCourseContent'
import UpdateAss from './pages/Assignment/Update'
import UpdateModule from './pages/Module/UpdateModule'
import Cart from './pages/Checkout/Cart'
import Success from "./pages/Checkout/Success";
import Cancel from "./pages/Checkout/Cancel";
import SubmittedAssignments from "./pages/Assignment/SubmittedAssignments";
import Messenger from "./pages/Messenger"
import Quiz from "./pages/InstructorQuiz/Quiz";
import StudentQuizDetail from "./pages/Quiz/StudentQuizDetail";
import StudentQuiz from "./pages/Quiz/StudentQuiz";
import Orders from "./pages/OrderSummary/orders"
import Career from "./pages/CareerRecommendation/CareerRecommendation"
import AdminSupport from "./pages/adminresponse"
import Certificate from "./pages/Certificate/certificate"

function App() {
  const user = localStorage.getItem("token");
  return (   
 
          <div className="font-Poppins bg-white" >
            <Routes>
               <Route path="/discover" element={<Discover />} />
               <Route path="/home" element={<Home/>} />  
               <Route path="/signup" element={<Signup />} />
               <Route path="/login" element={<Login />} />
               <Route path="/forgot-password" element={<ForgotPassword />} />
               <Route path="/password-reset/:id/:token" element={<PasswordReset />} />
               <Route path="/mylearning" element={<MyLearning />} />
               <Route path="/enrollments" element={<Discover />} />
               <Route path="/InstructorDasboard" element={<InstructorDasboard/>}/>
               <Route path="/Addassignments" element={<Assignment/>}/> 
               <Route path="/AddCourse" element={<Course/>} />
               <Route path="/DisplayCourse" element ={< DisplayCourse/>}/>
               <Route path="/UpdateCourse/:id" element={<Updatecourse/>}/>
               <Route path="/CourseDashboard" element={<Coursemainpage/>}/>
               <Route path="/AddModule" element={<ModulePage/>}/>
               <Route path="/updateAss/:Id" element={<UpdateAss/>}/>
               <Route path="/UpdateModule/:Id" element={<UpdateModule/>}/>
               
                {/* <Route path="/studentdashboard" element={<StudentDashboard />}>
                  <Route index element={<MyLearning />} />
                  <Route path="assignments" element={<UploadAssignment />} />
              </Route> */}

             <Route path="/studentdashboard" element={<StudentDashboard />}>
                <Route index element={<MyLearning />} />
                <Route path="assignments" element={<UploadAssignment />} />
                <Route path="quiz" element={<StudentQuizDetail />} />
                <Route path="orders" element={<Orders/>} />
                <Route path="certificates" element={<Certificate/>}/>
              </Route>

              <Route path="/career-recommendation" element={<Career/>}/>
            

              <Route path="/quiz/:courseId/:quizId" element={<StudentQuiz />} />
              <Route path="cart" element={<Cart/>}></Route>
              <Route path="success" element={<Success/>}></Route>
              <Route path="cancel" element={<Cancel/>}></Route>

              <Route path="submitted-assignments/:Id" element={<SubmittedAssignments/>}></Route>

               <Route path="/profilesettings" element={<ProfileSettings />} />
               <Route path="/viewcoursedetails/:id" element={<ViewCourseDetails/>} />
               <Route path="/accesscontent/:id" element={<AccessCourseContent/>} />
               <Route path="/admin-response" element={<AdminSupport/>}/>


               <Route path="/Messenger" element={<Messenger />} />

               <Route path="/instructor-quiz" element={<Quiz />} />
               
               <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to="/home"/>} />
               <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
               <Route path="/signup" element={<Signup />} />
               </Routes>
          </div>

      ) 

    }
 
  

export default App;
