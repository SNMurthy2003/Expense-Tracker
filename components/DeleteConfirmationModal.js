'use client';

// src/components/DeleteConfirmationModal.js
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ModalPortal from '@/components/ModalPortal';

const ModalOverlay = styled(motion.div)`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(239, 68, 68, 0.15) 100%);
  backdrop-filter: blur(12px) saturate(150%);
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(254, 242, 242, 0.85) 50%,
    rgba(254, 226, 226, 0.9) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  padding: 32px 28px;
  border-radius: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 30px 60px rgba(220, 38, 38, 0.25),
    0 15px 35px rgba(239, 68, 68, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    inset 0 -1px 2px rgba(220, 38, 38, 0.05);
  position: relative;
  border: 3px solid transparent;
  background-clip: padding-box;

  /* Premium gradient border on all sides */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    padding: 3px;
    background: linear-gradient(135deg,
      #fca5a5 0%,
      #f87171 25%,
      #dc2626 50%,
      #b91c1c 75%,
      #fca5a5 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.2);
    }
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px rgba(220, 38, 38, 0);
    }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 12px;
  margin-top: 0;
  color: #991b1b;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(220, 38, 38, 0.1);
`;

const ModalMessage = styled.p`
  color: #7f1d1d;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 28px;
  line-height: 1.6;
  font-weight: 500;
`;

const ItemName = styled.div`
  background: rgba(255, 255, 255, 0.7);
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
  color: #991b1b;
  border: 2px solid rgba(220, 38, 38, 0.2);
  font-size: 1.05rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

const Button = styled(motion.button)`
  padding: 12px 32px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;

  &.danger {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
    color: white;
    box-shadow:
      0 8px 20px rgba(220, 38, 38, 0.4),
      0 4px 12px rgba(239, 68, 68, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);

    /* Animated glow */
    &::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 70%
      );
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      transition: transform 0.6s ease;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 12px 28px rgba(220, 38, 38, 0.5),
        0 8px 16px rgba(239, 68, 68, 0.35),
        inset 0 1px 2px rgba(255, 255, 255, 0.4);
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);

      &::before {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow:
        0 4px 12px rgba(220, 38, 38, 0.4),
        0 2px 8px rgba(239, 68, 68, 0.3);
    }
  }

  &.secondary {
    background: rgba(226, 232, 240, 0.6);
    backdrop-filter: blur(10px);
    color: #475569;
    box-shadow:
      0 4px 12px rgba(148, 163, 184, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.5);
    border: 2px solid rgba(203, 213, 225, 0.4);

    &:hover {
      background: rgba(203, 213, 225, 0.7);
      transform: translateY(-2px);
      box-shadow:
        0 6px 16px rgba(148, 163, 184, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
      border-color: rgba(148, 163, 184, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow:
        0 2px 6px rgba(148, 163, 184, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.5);
    }
  }
`;

// Animation Variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const DeleteConfirmationModal = ({ show, onClose, onConfirm, itemName, itemType = 'item' }) => {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <ModalPortal>
          <ModalOverlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            data-modal="true"
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              data-modal-content="true"
            >
              <IconWrapper>🗑️</IconWrapper>

              <ModalTitle>Delete {itemType}?</ModalTitle>

              <ModalMessage>
                Are you sure you want to delete this {itemType.toLowerCase()}? This action cannot be undone.
              </ModalMessage>

              {itemName && <ItemName>{itemName}</ItemName>}

              <ButtonGroup>
                <Button
                  className="secondary"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </Button>
                <Button
                  className="danger"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        </ModalPortal>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;