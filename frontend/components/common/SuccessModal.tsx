import React from 'react';
import ReactDOM from 'react-dom';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessModal({ isOpen, onClose, message }: CustomModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000]">
      <div className="bg-white p-5 rounded-lg max-w-[500px] w-[90%]">
        <h2 className="text-xl font-bold mb-4">Succeed!!</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}