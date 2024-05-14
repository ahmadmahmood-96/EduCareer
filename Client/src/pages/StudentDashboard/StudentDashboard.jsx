import React from 'react';
import Sidebar, { SidebarItem } from '../../components/SideBar/SideBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faClipboard, faQuestionCircle,faHistory ,faCertificate} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
import Topbar from '../../components/Navbar/NavbarPage'
const StudentDashboard = () => {
  return (
    <div>
    <Topbar />
    <div className="relative flex flex-row ">
      
      <div  className="absolute">
      <div className="fixed left-0 top-18 h-full ">
        <Sidebar>
        <SidebarItem icon={<FontAwesomeIcon icon={faGraduationCap} />} text="Courses" to="/studentdashboard" />
          <SidebarItem icon={<FontAwesomeIcon icon={faClipboard} />} text="Assignments" to="/studentdashboard/assignments" />
          <SidebarItem icon={<FontAwesomeIcon icon={faQuestionCircle} />} text="Quiz" to="/studentdashboard/quiz"/>
          <SidebarItem icon={<FontAwesomeIcon icon={faHistory} />} text="Orders" to="/studentdashboard/orders"/>
          <SidebarItem icon={<FontAwesomeIcon icon={faCertificate} />} text="Certificates" to="/studentdashboard/certificates"/>
        </Sidebar>
      </div>

      <div className="ml-60 p-4 flex-grow bg-white rounded">
        <Outlet />
      </div>
      </div>
    
    </div>
    </div>
  );
};

export default StudentDashboard;
