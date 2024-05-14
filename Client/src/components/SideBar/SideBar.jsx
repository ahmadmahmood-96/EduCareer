import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MdAccountCircle } from 'react-icons/md';

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
 
 
  useEffect(() => {
    const userToken = localStorage.getItem('token');
    console.log(userToken);
    axios.get(`http://localhost:8080/api/user/${userToken}/user-details`)
      .then((response) => {
        const fullName = `${response.data.firstName} ${response.data.lastName}`;
        setUserInfo({ ...response.data, fullName });
        
      })
      .catch((error) => {
        console.error('Error fetching info:', error);
      });
  }, []);

  
  return (
    
    <aside className={`h-screen w-${expanded ? "60" : "20"}`} > 
      <nav className="h-full flex flex-col rounded text-white  bg-Teal border-r shadow-sm">
        <div className="flex items-center w-full px-3 mt-3" href="#">
          <div
            className={` text-lg overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
           > EDUCAREER
            </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="  p-1.5  mr-0 text-white  rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst className=" absolute -right-3 top-9 border border-Teal cursor-pointer shadow-md bg-Teal text-3xl rounded-full"/> : <ChevronLast />}
          </button>
        </div>

          <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700">
          <SidebarContext.Provider value={{ expanded}}>
                    
                    <ul className="flex-1 px-3 items-center w-full h-12 px-2 mt-2 rounded hover:bg-white-700" href="#">{children}</ul> 
                  </SidebarContext.Provider>
          </div>
       

       
          {userInfo && (
          <div className="border-t flex p-3 fixed bottom-0">
             <MdAccountCircle size={20} className="w-10 h-10 rounded-md" />
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}
            `}
            >
             <div className="leading-4">
              <h4 className="font-semibold">{userInfo.fullName}</h4>
              <span className="text-xs text-gray-600">{userInfo.email}</span>
              </div>
            
            </div>
          </div>
        )}
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, to }) {
    const { expanded } = useContext(SidebarContext)
    
    return (
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          hover:bg-teal-500 opacity-0.2 text-gray-600
        `}
      >
        <Link to={to} className=" flex items-center"     style={{ color: 'white', textDecoration: 'none' }}>

     
          {icon}
          <span className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}>
            {text}
          </span>
        </Link>
      </li>
    )
  }
  