'use client';

// src/components/IconPicker.js
import React from 'react'; // Removed { useState }
import styled from 'styled-components';
import { 
  FaQuestion, FaBriefcase, FaMoneyBillWave, FaPiggyBank, FaShopify, FaGift, FaGraduationCap, FaHome,
  FaShoppingBag, FaPlane, FaLightbulb, FaUniversity, FaUtensils, FaCar, FaHeartbeat, FaPaw
} from 'react-icons/fa';

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 10px;
  margin-top: 10px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 10px;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  background-color: ${props => props.selected ? 'var(--primary-blue)' : 'var(--background-light)'};
  color: ${props => props.selected ? 'white' : 'var(--text-dark)'};
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-blue)' : 'var(--border-light)'};
  }
`;

const icons = {
  // Income Icons
  'Briefcase': FaBriefcase,
  'Money Wave': FaMoneyBillWave,
  'Piggy Bank': FaPiggyBank,
  'Shopify': FaShopify,
  'Gift': FaGift,
  'Graduation Cap': FaGraduationCap,
  'Home': FaHome,
  // Expense Icons
  'Shopping Bag': FaShoppingBag,
  'Plane': FaPlane,
  'Lightbulb': FaLightbulb,
  'University': FaUniversity,
  'Utensils': FaUtensils,
  'Car': FaCar,
  'Heartbeat': FaHeartbeat,
  'Paw Print': FaPaw,
  'Question': FaQuestion, // Default if nothing matches
};

const IconPicker = ({ selectedIconName, onSelectIcon, type = 'income' }) => {
  // Filter icons based on type for better relevance
  const availableIcons = Object.entries(icons).filter(([name, IconComponent]) => {
    if (type === 'income') {
      return ['Briefcase', 'Money Wave', 'Piggy Bank', 'Shopify', 'Gift', 'Graduation Cap', 'Home', 'Question'].includes(name);
    } else { // type === 'expense'
      return ['Shopping Bag', 'Plane', 'Lightbulb', 'University', 'Utensils', 'Car', 'Heartbeat', 'Paw Print', 'Question'].includes(name);
    }
  });

  return (
    <div>
      <label style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '5px', display: 'block' }}>
        Select Icon
      </label>
      <IconGrid>
        {availableIcons.map(([name, IconComponent]) => (
          <IconWrapper
            key={name}
            selected={selectedIconName === name}
            onClick={() => onSelectIcon(name)}
          >
            <IconComponent />
          </IconWrapper>
        ))}
      </IconGrid>
    </div>
  );
};

export const getIconComponent = (iconName) => icons[iconName] || FaQuestion;
export default IconPicker;