import React from "react";

const ModalTnC = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
        
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white w-full">
            {title}
          </h2>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 text-justify mb-6">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
             It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
             It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
 

export default ModalTnC;