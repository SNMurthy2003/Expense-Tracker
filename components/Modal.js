'use client';

// src/components/Modal.js
import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import ModalPortal from '@/components/ModalPortal';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--card-bg);
  padding: 30px 30px 40px 30px; /* extra bottom padding so buttons are visible */
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 450px;
  max-width: 90%;
  max-height: 90vh;      /* limit modal height */
  overflow-y: auto;      /* allow scrolling if content is too tall */
  position: relative;
  animation: fadeInDown 0.3s ease-out;

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: var(--text-dark);
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: var(--text-dark);
`;

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <ModalPortal>
      <ModalOverlay onClick={onClose} data-modal="true">
        <ModalContent onClick={e => e.stopPropagation()} data-modal-content="true"> {/* Prevent closing when clicking inside content */}
          <CloseButton onClick={onClose}><FaTimes /></CloseButton>
          <ModalTitle>{title}</ModalTitle>
          {children}
        </ModalContent>
      </ModalOverlay>
    </ModalPortal>
  );
};

export default Modal;
