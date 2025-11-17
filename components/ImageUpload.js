'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const UploadSection = styled.div`
  margin-bottom: 0;
`;

const SectionTitle = styled.label`
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1e3a8a;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
`;

const UploadArea = styled.div`
  position: relative;
  border: 2px dashed ${props => props.$hasError ? '#ef4444' : '#93c5fd'};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  background: ${props => props.$isDragging ?
    'linear-gradient(135deg, rgba(147, 197, 253, 0.15), rgba(96, 165, 250, 0.1))' :
    'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(240, 249, 255, 0.3))'
  };
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #60a5fa;
    background: linear-gradient(135deg, rgba(147, 197, 253, 0.2), rgba(96, 165, 250, 0.15));
    transform: translateY(-2px);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  filter: drop-shadow(0 2px 4px rgba(96, 165, 250, 0.3));
`;

const UploadText = styled.p`
  color: #475569;
  font-size: 14px;
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const UploadHint = styled.p`
  color: #94a3b8;
  font-size: 12px;
  margin: 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreview = styled(motion.div)`
  position: relative;
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.15);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  display: block;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
`;

const RemoveButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1) rotate(90deg);
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5);
  }

  &:active {
    transform: scale(0.95) rotate(90deg);
  }
`;

const ErrorMessage = styled(motion.p)`
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 0;
  font-weight: 500;
`;

const ImageUpload = ({ image, onImageChange, onImageRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSizeInMB = 5;

  const validateFile = (file) => {
    if (!file) return 'No file selected';

    if (!allowedTypes.includes(file.type)) {
      return 'Only .jpg, .jpeg, .png, and .webp files are allowed';
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeInMB) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    onImageChange(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setError('');
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getImagePreviewUrl = () => {
    if (!image) return null;

    // If image is a File object (newly selected)
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    // If image is a URL string (existing image from server)
    if (typeof image === 'string') {
      return `http://localhost:5000${image}`;
    }

    return null;
  };

  const previewUrl = getImagePreviewUrl();

  return (
    <UploadSection>
      <SectionTitle>Upload Receipt (Optional)</SectionTitle>

      {!previewUrl ? (
        <>
          <UploadArea
            $isDragging={isDragging}
            $hasError={!!error}
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadIcon>📷</UploadIcon>
            <UploadText>Click to upload or drag and drop</UploadText>
            <UploadHint>JPG, JPEG, PNG, or WEBP (max {maxSizeInMB}MB)</UploadHint>
          </UploadArea>

          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <ImagePreview
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <PreviewImage src={previewUrl} alt="Receipt preview" />
          <RemoveButton
            onClick={handleRemove}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </RemoveButton>
        </ImagePreview>
      )}

      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>
    </UploadSection>
  );
};

export default ImageUpload;