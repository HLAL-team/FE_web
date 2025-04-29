import React from "react";

const ModalAlert = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm w-full">
          <p className="mb-4 text-center">{message}</p>
          <div className="flex justify-center">
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalAlert;
  
