import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const DynamicAccordion = ({ modules, onModuleClick }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="pb-8">
      {modules.map((module, index) => (
        <div key={module._id} className="pb-8">
          <div className="flex items-center justify-between">
            <div
              className="sm:text-xl text-base font-bold cursor-pointer"
              onClick={() => {
                handleClick(index);
                onModuleClick(module);
              }}
            >
              {module.title}
            </div>
            <BsChevronDown
              className={`${
                index === activeIndex ? "rotate-180" : "rotate-0"
              } cursor-pointer transition-all duration-300`}
              onClick={() => handleClick(index)}
            />
          </div>
          <AnimatePresence>
            {index === activeIndex && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
                className="pt-4"
              >
                <p className="text-sm leading-7 text-black bg-Solitude">
                  {module.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default DynamicAccordion;
