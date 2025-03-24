import React from 'react';
import ReactDOM from 'react-dom';
import '@/components/styles/SuccessModal.module.css';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessModal({ isOpen, onClose, message }: CustomModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Succeed!!</h2>
        <p>{message}</p>
        <div className="modal-button-container">
          <button onClick={onClose} className="modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
