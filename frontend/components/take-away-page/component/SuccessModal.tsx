import React from 'react';
import ReactDOM from 'react-dom';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function CustomModal({ isOpen, onClose, message }: CustomModalProps) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <h2>Your order has been submitted successfully! </h2>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#facc16', 
              color: 'black',             
              padding: '0.6rem 1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
