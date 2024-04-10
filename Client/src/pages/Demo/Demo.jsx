import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)
 
  
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
            className="p-1.5  text-white  rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

          <div className="flex flex-col items-center w-full mt-2 border-t border-gray-700">
          <SidebarContext.Provider value={{ expanded}}>
                    
                    <ul className="flex-1 px-3 items-center w-full h-12 px-3 mt-2 rounded hover:bg-white-700" href="#">{children}</ul> 
                  </SidebarContext.Provider>
          </div>
       

        <div className="border-t flex p-3 fixed bottom-0">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-40 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">John Doe</h4>
              <span className="text-xs text-gray-600">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        hover:bg-indigo-50 text-gray-600
       
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      
    </li>
  )
}