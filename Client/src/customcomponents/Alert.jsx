import React from 'react';
import { IoClose, IoAlertCircle } from 'react-icons/io5';

const Alert = ({ children, style, alertItemsStyle, onClose }) => {

  return (
    <div
      className={`flex p-4 mb-4 rounded-lg  ${style}`}
      role="alert"
    >
      {/* Alert Icon */}
      <div className={`flex-shrink-0 w-5 h-5 text-light ${alertItemsStyle}`}>
        <IoAlertCircle className="w-5 h-5" />
      </div>
      <div className={`ml-3 text-sm font-medium text-light  ${alertItemsStyle}`}>{children}</div>
      {/* Close Icon */}
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-light ${alertItemsStyle}`}
        onClick={onClose}
      >
        <span className="sr-only">Dismiss</span>
        <IoClose className="w-5 h-5" />
      </button>
    </div>
  ) 
};

export default Alert;
