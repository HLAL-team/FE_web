import React from "react";

const ModalTnC = ({ isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-3xl mx-4">
        
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white w-full">
            {title}
          </h2>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300 text-justify mb-6">
          <p>
          Welcome to HLAL, a sharia-compliant digital wallet developed by Group Two of ODP IT BSI Batch 24. By using our services, you agree to these terms. 
Users must register with accurate information and are responsible for keeping their account and password secure. HLAL may suspend accounts involved in suspicious activity. HLAL is intended only for lawful transactions and may not be used for fraud, gambling, drugs, or any illegal purposes. Users can top up their balance via official HLAL partners. HLAL is not responsible for user errors during transactions.
Certain admin fees may apply and will be shown in the app. Users are responsible for any taxes resulting from transactions. HLAL will never ask for your PIN or OTP via phone, email, or social media.
HLAL may block or close accounts if legal violations are suspected or based on orders from authorities. These terms may change over time, and users will be notified through the app or email. All terms are governed by Indonesian law, and disputes will be resolved by authorized courts.
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