'use client';

// src/components/AllTeamsDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChevronDown, FaCheck } from 'react-icons/fa';
import { darkTheme } from '@/styles/darkTheme';

// Styled Components - DARK THEME
const DropdownContainer = styled.div`
  position: relative;
  width: fit-content;
  min-width: 160px;
  max-width: 180px;
  margin-bottom: 20px;
  z-index: 1000;
  isolation: isolate;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const DropdownButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  background: ${props => props.isOpen
    ? darkTheme.background.glass
    : darkTheme.background.panel};
  backdrop-filter: blur(8px) saturate(180%);
  border: 1.5px solid ${props => props.isOpen ? darkTheme.accent.cyan : darkTheme.border.light};
  border-radius: ${darkTheme.radius.md};
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${darkTheme.text.primary};
  box-shadow: ${props => props.isOpen
    ? darkTheme.shadow.glow
    : darkTheme.shadow.soft};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${darkTheme.shadow.medium};
    border-color: ${props => props.isOpen ? darkTheme.accent.cyan : darkTheme.border.medium};
    background: ${darkTheme.background.glassHover};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(27, 211, 255, 0.15);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${darkTheme.accent.gradient};
  border-radius: 6px;
  color: white;
  font-size: 0.7rem;
  flex-shrink: 0;
  box-shadow: ${darkTheme.accent.glowCyan};
`;

const ButtonText = styled.span`
  flex: 1;
  text-align: left;
  color: ${darkTheme.text.primary};
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${darkTheme.text.secondary};
  font-size: 0.75rem;
  flex-shrink: 0;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  min-width: 160px;
  background: ${darkTheme.background.panel};
  backdrop-filter: blur(16px) saturate(180%);
  border: 1.5px solid ${darkTheme.border.medium};
  border-radius: ${darkTheme.radius.md};
  box-shadow: ${darkTheme.shadow.medium};
  overflow: hidden;
  max-height: 280px;
  overflow-y: auto;
  z-index: 1001;

  /* Gradient border effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${darkTheme.radius.md};
    padding: 1.5px;
    background: ${darkTheme.accent.gradient};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0.3;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(27, 211, 255, 0.04);
  }

  &::-webkit-scrollbar-thumb {
    background: ${darkTheme.accent.gradient};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${darkTheme.accent.cyan};
  }
`;

const MenuItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${props => props.isSelected ? darkTheme.accent.cyan : darkTheme.text.secondary};
  background: ${props => props.isSelected
    ? 'linear-gradient(90deg, rgba(27, 211, 255, 0.1) 0%, rgba(45, 212, 191, 0.06) 100%)'
    : 'transparent'};
  border-left: 2.5px solid ${props => props.isSelected ? darkTheme.accent.cyan : 'transparent'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    background: ${props => props.isSelected
      ? 'linear-gradient(90deg, rgba(27, 211, 255, 0.15) 0%, rgba(45, 212, 191, 0.1) 100%)'
      : 'rgba(27, 211, 255, 0.05)'};
    color: ${darkTheme.accent.cyan};
    border-left-color: ${props => props.isSelected ? darkTheme.accent.cyan : 'rgba(27, 211, 255, 0.3)'};
  }

  &:active {
    transform: scale(0.99);
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${darkTheme.border.light};
  }
`;

const MenuItemLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CheckIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${darkTheme.accent.cyan};
  font-size: 0.75rem;
  margin-left: 8px;
`;

const TeamBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  margin-left: 6px;
  background: ${props => props.isAll
    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'};
  color: white;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

const TeamCount = styled.span`
  font-size: 0.75rem;
  color: ${darkTheme.text.secondary};
  margin-left: 4px;
  font-weight: 500;
`;

// Animation variants - ENHANCED REVEAL EFFECT
const menuVariants = {
  hidden: {
    opacity: 0,
    y: -12,
    scale: 0.94,
    rotateX: -15,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.04,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    y: -4
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const AllTeamsDropdown = ({ teams = [], selectedTeam, onTeamChange, label = "Select Team" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (teamName) => {
    onTeamChange(teamName);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!selectedTeam) {
      return (
        <>
          All Teams
          <TeamBadge isAll>All</TeamBadge>
        </>
      );
    }
    return (
      <>
        {selectedTeam}
      </>
    );
  };

  return (
    <DropdownContainer ref={dropdownRef} data-dropdown="true">
      <DropdownButton
        onClick={handleToggle}
        isOpen={isOpen}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ButtonContent>
          <IconWrapper>
            <FaUsers />
          </IconWrapper>
          <ButtonText>{getDisplayText()}</ButtonText>
        </ButtonContent>
        <ChevronIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <FaChevronDown />
        </ChevronIcon>
      </DropdownButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
          >
            <MenuItem
              variants={itemVariants}
              onClick={() => handleSelect('')}
              isSelected={!selectedTeam}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.99 }}
              role="option"
              aria-selected={!selectedTeam}
            >
              <MenuItemLabel>
                All Teams
                <TeamCount>({teams.length})</TeamCount>
              </MenuItemLabel>
              {!selectedTeam && (
                <CheckIcon
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <FaCheck />
                </CheckIcon>
              )}
            </MenuItem>

            {teams.map((team, index) => {
              const isSelected = selectedTeam === team.teamName;
              return (
                <MenuItem
                  key={team._id || index}
                  variants={itemVariants}
                  onClick={() => handleSelect(team.teamName)}
                  isSelected={isSelected}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <MenuItemLabel>{team.teamName}</MenuItemLabel>
                  {isSelected && (
                    <CheckIcon
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <FaCheck />
                    </CheckIcon>
                  )}
                </MenuItem>
              );
            })}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export default AllTeamsDropdown;
