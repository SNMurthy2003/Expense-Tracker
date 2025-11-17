'use client';

// src/components/EditExpenseModal.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(96, 165, 250, 0.15) 100%);
  backdrop-filter: blur(12px) saturate(150%);
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(240, 249, 255, 0.75) 50%,
    rgba(219, 234, 254, 0.8) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  padding: 32px 28px;
  border-radius: 32px;
  width: 100%;
  max-width: 450px;
  box-shadow:
    0 30px 60px rgba(79, 70, 229, 0.25),
    0 15px 35px rgba(96, 165, 250, 0.15),
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    inset 0 -1px 2px rgba(79, 70, 229, 0.05);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
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
      #93c5fd 0%,
      #60a5fa 25%,
      #4f46e5 50%,
      #a78bfa 75%,
      #93c5fd 100%
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

  /* Enhanced scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(191, 219, 254, 0.3);
    border-radius: 4px;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%);
    border-radius: 4px;
    border: 2px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
    }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 24px;
  margin-top: 0;
  color: #1e3a8a;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  text-shadow: 0 2px 8px rgba(96, 165, 250, 0.2);
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.8;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid rgba(191, 219, 254, 0.4);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 2px 6px rgba(96, 165, 250, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.8);
  font-weight: 500;
  color: #1e3a8a;

  &:focus {
    outline: none;
    border-color: #60a5fa;
    background: rgba(255, 255, 255, 0.9);
    box-shadow:
      0 0 0 4px rgba(96, 165, 250, 0.15),
      inset 0 2px 6px rgba(96, 165, 250, 0.1),
      0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  &:hover:not(:focus) {
    border-color: rgba(147, 197, 253, 0.6);
    box-shadow:
      inset 0 2px 6px rgba(96, 165, 250, 0.15),
      0 2px 8px rgba(96, 165, 250, 0.1);
  }

  &::placeholder {
    color: #93c5fd;
    font-weight: 400;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid rgba(191, 219, 254, 0.4);
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 2px 6px rgba(96, 165, 250, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-weight: 500;
  color: #1e3a8a;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%233b82f6' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 48px;

  &:focus {
    outline: none;
    border-color: #60a5fa;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow:
      0 0 0 4px rgba(96, 165, 250, 0.15),
      inset 0 2px 6px rgba(96, 165, 250, 0.1),
      0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  &:hover:not(:focus) {
    border-color: rgba(147, 197, 253, 0.6);
    box-shadow:
      inset 0 2px 6px rgba(96, 165, 250, 0.15),
      0 2px 8px rgba(96, 165, 250, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid rgba(191, 219, 254, 0.4);
  border-radius: 16px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 2px 6px rgba(96, 165, 250, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.8);
  font-weight: 500;
  color: #1e3a8a;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: #60a5fa;
    background: rgba(255, 255, 255, 0.9);
    box-shadow:
      0 0 0 4px rgba(96, 165, 250, 0.15),
      inset 0 2px 6px rgba(96, 165, 250, 0.1),
      0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  &:hover:not(:focus) {
    border-color: rgba(147, 197, 253, 0.6);
    box-shadow:
      inset 0 2px 6px rgba(96, 165, 250, 0.15),
      0 2px 8px rgba(96, 165, 250, 0.1);
  }

  &::placeholder {
    color: #93c5fd;
    font-weight: 400;
  }
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

  &.primary {
    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%);
    color: white;
    box-shadow:
      0 8px 20px rgba(59, 130, 246, 0.4),
      0 4px 12px rgba(96, 165, 250, 0.3),
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
        0 12px 28px rgba(59, 130, 246, 0.5),
        0 8px 16px rgba(96, 165, 250, 0.35),
        inset 0 1px 2px rgba(255, 255, 255, 0.4);
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);

      &::before {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow:
        0 4px 12px rgba(59, 130, 246, 0.4),
        0 2px 8px rgba(96, 165, 250, 0.3);
    }
  }

  &.secondary {
    background: rgba(226, 232, 240, 0.6);
    backdrop-filter: blur(10px);
    color: #1e40af;
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

const ErrorText = styled(motion.div)`
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 20px;
  padding: 14px 18px;
  background: linear-gradient(135deg,
    rgba(254, 202, 202, 0.5) 0%,
    rgba(252, 165, 165, 0.4) 100%
  );
  backdrop-filter: blur(10px);
  border-left: 4px solid #ef4444;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);

  &::before {
    content: '⚠';
    font-size: 1.2rem;
  }
`;

const CustomCategoryWrapper = styled(motion.div)`
  overflow: hidden;
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

const errorVariants = {
  hidden: { opacity: 0, y: -15, scale: 0.9, height: 0, marginBottom: 0 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    height: 'auto',
    marginBottom: 20,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    height: 0,
    marginBottom: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const customCategoryVariants = {
  hidden: { opacity: 0, height: 0, y: -10, marginBottom: 0 },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    marginBottom: 20,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -10,
    marginBottom: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const EditExpenseModal = ({ show, onClose, onEditExpense, expense }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    customCategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Populate form when expense prop changes
  useEffect(() => {
    if (expense) {
      const isCustomCategory = !['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Groceries'].includes(expense.category);
      setFormData({
        title: expense.title || '',
        amount: expense.amount || '',
        category: isCustomCategory ? 'Other' : expense.category || 'Food',
        customCategory: isCustomCategory ? expense.category : '',
        description: expense.description || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [expense]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (formData.category === 'Other' && !formData.customCategory.trim()) {
      setError('Please enter a custom category name');
      return;
    }

    const finalCategory = formData.category === 'Other'
      ? formData.customCategory.trim()
      : formData.category;

    const updatedExpense = {
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: finalCategory,
      description: formData.description,
      date: formData.date
    };

    onEditExpense(updatedExpense);
    setError('');
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {show && (
        <ModalOverlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <ModalContent
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <ModalTitle>Edit Expense</ModalTitle>

            <AnimatePresence mode="wait">
              {error && (
                <ErrorText
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {error}
                </ErrorText>
              )}
            </AnimatePresence>

            <Input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />

            <Input
              type="number"
              placeholder="$ Amount"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
            />

            <Select
              value={formData.category}
              onChange={e => {
                setFormData({ ...formData, category: e.target.value });
                if (e.target.value !== 'Other') {
                  setFormData(prev => ({ ...prev, customCategory: '' }));
                }
              }}
            >
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Utilities">💡 Utilities</option>
              <option value="Healthcare">🏥 Healthcare</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Groceries">🥬 Groceries</option>
              <option value="Other">••• Other</option>
            </Select>

            <AnimatePresence mode="wait">
              {formData.category === 'Other' && (
                <CustomCategoryWrapper
                  variants={customCategoryVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Input
                    type="text"
                    placeholder="Enter custom category"
                    value={formData.customCategory}
                    onChange={e => setFormData({ ...formData, customCategory: e.target.value })}
                  />
                </CustomCategoryWrapper>
              )}
            </AnimatePresence>

            <Input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />

            <TextArea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <ButtonGroup>
              <Button
                className="secondary"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </Button>
              <Button
                className="primary"
                onClick={handleSubmit}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Update Expense
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default EditExpenseModal;