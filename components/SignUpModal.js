'use client';

// src/components/SignUpModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/firebase';
import {
  createUserWithEmailAndPassword
} from 'firebase/auth';

/* ======== Styled Components ======== */

const ModalOverlay = styled(motion.div)`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(145deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(240, 249, 255, 0.9) 50%,
    rgba(219, 234, 254, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  padding: 40px 45px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow:
    0 30px 60px rgba(47, 128, 237, 0.3),
    0 15px 35px rgba(96, 165, 250, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.9);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000000;
  box-sizing: border-box;

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

const ModalTitle = styled.h2`
  margin: 0 0 10px 0;
  color: #1e3a8a;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.02em;
`;

const ModalSubtitle = styled.p`
  margin: 0 0 30px 0;
  color: #64748b;
  font-size: 0.95rem;
  text-align: center;
  font-weight: 500;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.twoColumns ? '1fr 1fr' : '1fr'};
  gap: 16px;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e40af;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.9;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(191, 219, 254, 0.5);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 2px 6px rgba(96, 165, 250, 0.1),
    0 1px 2px rgba(255, 255, 255, 0.8);
  font-weight: 500;
  color: #1e3a8a;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2f80ed;
    background: rgba(255, 255, 255, 0.95);
    box-shadow:
      0 0 0 4px rgba(47, 128, 237, 0.15),
      inset 0 2px 6px rgba(96, 165, 250, 0.1),
      0 4px 12px rgba(59, 130, 246, 0.2);
    transform: translateY(-2px);
  }

  &:hover:not(:focus) {
    border-color: rgba(96, 165, 250, 0.7);
    box-shadow:
      inset 0 2px 6px rgba(96, 165, 250, 0.15),
      0 2px 8px rgba(96, 165, 250, 0.1);
  }

  &::placeholder {
    color: #93c5fd;
    font-weight: 400;
  }
`;

const ErrorText = styled(motion.div)`
  color: #dc2626;
  font-size: 0.85rem;
  padding: 12px 16px;
  background: linear-gradient(135deg,
    rgba(254, 202, 202, 0.5) 0%,
    rgba(252, 165, 165, 0.4) 100%
  );
  backdrop-filter: blur(10px);
  border-left: 4px solid #ef4444;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
  margin-bottom: 20px;

  &::before {
    content: '⚠';
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 30px;
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;

  &.primary {
    background: linear-gradient(135deg, #2f80ed 0%, #1d4ed8 100%);
    color: white;
    box-shadow:
      0 8px 20px rgba(47, 128, 237, 0.4),
      0 4px 12px rgba(59, 130, 246, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);

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
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%
      );
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      transition: transform 0.6s ease;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 12px 28px rgba(47, 128, 237, 0.5),
        0 8px 16px rgba(59, 130, 246, 0.35),
        inset 0 1px 2px rgba(255, 255, 255, 0.4);
      background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);

      &::before {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow:
        0 4px 12px rgba(47, 128, 237, 0.4),
        0 2px 8px rgba(59, 130, 246, 0.3);
    }
  }

  &.secondary {
    background: rgba(226, 232, 240, 0.7);
    backdrop-filter: blur(10px);
    color: #1e40af;
    box-shadow:
      0 4px 12px rgba(148, 163, 184, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.5);
    border: 2px solid rgba(203, 213, 225, 0.5);

    &:hover {
      background: rgba(203, 213, 225, 0.8);
      transform: translateY(-2px);
      box-shadow:
        0 6px 16px rgba(148, 163, 184, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.6);
      border-color: rgba(148, 163, 184, 0.6);
    }

    &:active {
      transform: translateY(0);
      box-shadow:
        0 2px 6px rgba(148, 163, 184, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.5);
    }
  }
`;

/* ======== Animation Variants ======== */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.34, 1.26, 0.64, 1],
      opacity: { duration: 0.3 }
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 30,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] }
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

/* ======== Component ======== */

const SignUpModal = ({ show, onClose, onSignUp }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    // First Name validation
    if (!formData.firstName.trim()) {
      setError('Please enter your first name');
      return false;
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      setError('Please enter your last name');
      return false;
    }

    // Mobile validation (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation (minimum 8 characters)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create new account with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('✅ Account created successfully for:', formData.email);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: ''
      });
      setError('');

      // Close modal and call onSignUp callback if provided
      onClose();
      if (onSignUp) {
        await onSignUp({ ...formData, uid: userCredential.user.uid });
      }

      alert('Account created successfully! You can now log in.');
    } catch (err) {
      console.error('Sign up error:', err);

      // User-friendly error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError(err.message || 'Sign up failed. Please try again.');
      }
    }
  };

  const handleClose = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      password: ''
    });
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
            <ModalTitle>Create Account</ModalTitle>
            <ModalSubtitle>Join us to start tracking your expenses</ModalSubtitle>

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

            <form onSubmit={handleSubmit}>
              {/* First Name & Last Name Row */}
              <FormRow twoColumns>
                <InputGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                </InputGroup>

                <InputGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                </InputGroup>
              </FormRow>

              {/* Mobile Number */}
              <FormRow>
                <InputGroup>
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    name="mobile"
                    placeholder="1234567890"
                    value={formData.mobile}
                    onChange={handleChange}
                    autoComplete="tel"
                    maxLength="10"
                  />
                </InputGroup>
              </FormRow>

              {/* Email Address */}
              <FormRow>
                <InputGroup>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </InputGroup>
              </FormRow>

              {/* Password */}
              <FormRow>
                <InputGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Minimum 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </InputGroup>
              </FormRow>

              {/* Buttons */}
              <ButtonGroup>
                <Button
                  type="button"
                  className="secondary"
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;
