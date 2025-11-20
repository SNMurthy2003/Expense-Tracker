'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import { useModal } from '@/context/ModalContext';
import AddIncomeModal from '@/components/AddIncomeModal';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditIncomeModal from '@/components/EditIncomeModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { darkTheme } from '@/styles/darkTheme';

// --- Styled Components ---
const TeamsContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  background: ${darkTheme.background.primary};
  font-family: ${darkTheme.font.primary};
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(176, 101, 255, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(176, 101, 255, 0.5);
  }

  /* Parallax background decorations */
  &::before {
    content: '';
    position: fixed;
    top: -20%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(176, 101, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -20%;
    left: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
    animation: float 25s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.05); }
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  font-family: ${darkTheme.font.primary};
  background: ${darkTheme.brand.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(176, 101, 255, 0.3);
`;

const AddTeamButton = styled(motion.button)`
  background: ${darkTheme.brand.primary};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: ${darkTheme.radius.sm};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  font-family: ${darkTheme.font.primary};
  box-shadow: ${darkTheme.shadow.glow};
  transition: all ${darkTheme.transition.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${darkTheme.brand.primaryHover};
    transform: scale(1.05);
    box-shadow: ${darkTheme.shadow.glowLarge};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(27, 211, 255, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${darkTheme.shadow.glow};
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 28px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamCard = styled(motion.div)`
  background: ${darkTheme.background.panel};
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: ${darkTheme.radius.xl};
  padding: 28px;
  position: relative;
  overflow: hidden;
  border: 1px solid ${darkTheme.border.light};
  box-shadow: ${props => props.expanded
    ? darkTheme.shadow.medium
    : darkTheme.shadow.soft};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Glassmorphism effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${darkTheme.brand.gradient};
    opacity: ${props => props.expanded ? '1' : '0.6'};
    transition: opacity 0.3s ease;
    box-shadow: ${props => props.expanded ? darkTheme.shadow.glow : 'none'};
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${darkTheme.shadow.medium};
    border-color: ${darkTheme.brand.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  cursor: pointer;
`;

const TeamName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${darkTheme.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${darkTheme.radius.lg};
  background: ${darkTheme.brand.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  box-shadow: ${darkTheme.shadow.glow};
`;

const ExpandIcon = styled(motion.div)`
  width: 36px;
  height: 36px;
  border-radius: ${darkTheme.radius.md};
  background: rgba(27, 211, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${darkTheme.brand.primary};
  font-size: 1.3rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(27, 211, 255, 0.2);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeleteTeamButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: ${darkTheme.radius.md};
  background: rgba(124, 92, 255, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${darkTheme.brand.accent};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(124, 92, 255, 0.2);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 18px;
`;

const StatItem = styled.div`
  background: ${props => {
    if (props.type === 'income') return 'linear-gradient(135deg, rgba(45, 212, 191, 0.12) 0%, rgba(45, 212, 191, 0.06) 100%)';
    if (props.type === 'expense') return 'linear-gradient(135deg, rgba(124, 92, 255, 0.12) 0%, rgba(124, 92, 255, 0.06) 100%)';
    return 'linear-gradient(135deg, rgba(27, 211, 255, 0.12) 0%, rgba(27, 211, 255, 0.06) 100%)';
  }};
  padding: 14px;
  border-radius: ${darkTheme.radius.lg};
  border: 1px solid ${props => {
    if (props.type === 'income') return 'rgba(45, 212, 191, 0.25)';
    if (props.type === 'expense') return 'rgba(124, 92, 255, 0.25)';
    return 'rgba(27, 211, 255, 0.25)';
  }};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => {
    if (props.type === 'income') return darkTheme.chart.income;
    if (props.type === 'expense') return darkTheme.brand.accent;
    return darkTheme.brand.primary;
  }};
  margin-bottom: 6px;
  opacity: 0.85;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    if (props.type === 'income') return darkTheme.chart.income;
    if (props.type === 'expense') return darkTheme.brand.accent;
    return darkTheme.brand.primary;
  }};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: ${darkTheme.radius.full};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.active
    ? 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)'
    : 'linear-gradient(135deg, #64748b 0%, #475569 100%)'};
  color: white;
  box-shadow: ${props => props.active
    ? darkTheme.shadow.glow
    : '0 2px 8px rgba(100, 116, 139, 0.2)'};
`;

const BalanceBar = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  overflow: hidden;
  margin-top: 14px;
  position: relative;
`;

const BalanceFill = styled(motion.div)`
  height: 100%;
  background: ${props => props.positive
    ? 'linear-gradient(90deg, #2dd4bf 0%, #14b8a6 100%)'
    : 'linear-gradient(90deg, #7c5cff 0%, #6366f1 100%)'};
  border-radius: 5px;
  box-shadow: 0 0 10px ${props => props.positive ? darkTheme.shadow.glow : '0 0 10px rgba(124, 92, 255, 0.4)'};
`;

const ExpandedContent = styled(motion.div)`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid ${darkTheme.border.light};
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: ${darkTheme.radius.lg};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &.income {
    background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
    color: white;
    box-shadow: ${darkTheme.shadow.glow};

    &:hover {
      box-shadow: 0 6px 20px rgba(45, 212, 191, 0.4);
      transform: translateY(-2px);
    }
  }

  &.expense {
    background: ${darkTheme.brand.gradientPurple};
    color: white;
    box-shadow: 0 4px 14px rgba(124, 92, 255, 0.3);

    &:hover {
      box-shadow: 0 6px 20px rgba(124, 92, 255, 0.4);
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const TransactionsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${darkTheme.text.secondary};
  margin-bottom: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(27, 211, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(27, 211, 255, 0.5);
    }
  }
`;

const TransactionItem = styled(motion.div)`
  background: ${props => props.type === 'income'
    ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(45, 212, 191, 0.04) 100%)'
    : 'linear-gradient(135deg, rgba(124, 92, 255, 0.08) 0%, rgba(124, 92, 255, 0.04) 100%)'};
  padding: 14px 16px;
  border-radius: ${darkTheme.radius.md};
  border-left: 3px solid ${props => props.type === 'income' ? darkTheme.chart.income : darkTheme.brand.accent};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.type === 'income'
      ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.12) 0%, rgba(45, 212, 191, 0.06) 100%)'
      : 'linear-gradient(135deg, rgba(124, 92, 255, 0.12) 0%, rgba(124, 92, 255, 0.06) 100%)'};
    transform: translateX(4px);
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  font-weight: 600;
  color: ${darkTheme.text.primary};
  font-size: 0.95rem;
  margin-bottom: 4px;
`;

const TransactionDetails = styled.div`
  font-size: 0.8rem;
  color: ${darkTheme.text.tertiary};
  display: flex;
  gap: 12px;
`;

const TransactionAmount = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: ${props => props.type === 'income' ? darkTheme.chart.income : darkTheme.brand.accent};
  margin-right: 12px;
`;

const TransactionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${darkTheme.radius.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &.edit {
    background: rgba(27, 211, 255, 0.1);
    color: ${darkTheme.brand.primary};

    &:hover {
      background: rgba(27, 211, 255, 0.2);
      transform: scale(1.1);
    }
  }

  &.delete {
    background: rgba(124, 92, 255, 0.1);
    color: ${darkTheme.brand.accent};

    &:hover {
      background: rgba(124, 92, 255, 0.2);
      transform: scale(1.1);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 20px;
  color: ${darkTheme.text.tertiary};
  font-size: 0.9rem;
  font-style: italic;
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${darkTheme.text.secondary};
  font-size: 1.1rem;
  margin-top: 100px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(7, 20, 34, 0.8);
  backdrop-filter: blur(12px) saturate(150%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${darkTheme.background.panel};
  backdrop-filter: blur(20px) saturate(180%);
  padding: 32px 28px;
  border-radius: ${darkTheme.radius.xl};
  width: 100%;
  max-width: 450px;
  box-shadow: ${darkTheme.shadow.strong};
  position: relative;
  border: 2px solid ${darkTheme.border.light};

  /* Premium gradient border on all sides */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${darkTheme.radius.xl};
    padding: 2px;
    background: ${darkTheme.brand.gradient};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
    animation: borderGlow 3s ease-in-out infinite;
  }

  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.6;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.3);
    }
  }
`;

const ModalTitle = styled.h3`
  margin-bottom: 24px;
  margin-top: 0;
  color: ${darkTheme.text.primary};
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-align: center;
  text-shadow: ${darkTheme.shadow.glow};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 2px solid ${darkTheme.border.light};
  border-radius: ${darkTheme.radius.md};
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: ${darkTheme.shadow.inner};
  font-weight: 500;
  color: ${darkTheme.text.primary};

  &:focus {
    outline: none;
    border-color: ${darkTheme.brand.primary};
    background: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 0 0 4px rgba(27, 211, 255, 0.15),
      ${darkTheme.shadow.inner};
    transform: translateY(-2px);
  }

  &:hover:not(:focus) {
    border-color: ${darkTheme.border.medium};
    background: rgba(255, 255, 255, 0.07);
  }

  &::placeholder {
    color: ${darkTheme.text.tertiary};
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
  border-radius: ${darkTheme.radius.md};
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;

  &.primary {
    background: ${darkTheme.brand.gradient};
    color: white;
    box-shadow: ${darkTheme.shadow.glow};
    border: 1px solid rgba(255, 255, 255, 0.1);

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
        rgba(255, 255, 255, 0.3) 50%,
        transparent 70%
      );
      transform: translateX(-100%) translateY(-100%) rotate(45deg);
      transition: transform 0.6s ease;
    }

    &:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 28px rgba(27, 211, 255, 0.4);

      &::before {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    &:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow: ${darkTheme.shadow.glow};
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    color: ${darkTheme.text.secondary};
    box-shadow: ${darkTheme.shadow.inner};
    border: 2px solid ${darkTheme.border.light};

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      border-color: ${darkTheme.border.medium};
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function TeamsPage() {
  // Get global modal context
  const {
    openIncomeModal,
    openExpenseModal,
    showIncomeModal,
    showExpenseModal,
    selectedTeam,
    closeIncomeModal,
    closeExpenseModal
  } = useModal();

  const [teams, setTeams] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ teamName: '' });
  const [expandedCard, setExpandedCard] = useState(null);

  // Edit/Delete modal states (keep local since not used globally)
  const [showEditIncomeModal, setShowEditIncomeModal] = useState(false);
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Current selections
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch all data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamRes, incomeRes, expenseRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/income'),
        fetch('/api/expense')
      ]);

      const [teamData, incomeData, expenseData] = await Promise.all([
        teamRes.json(),
        incomeRes.json(),
        expenseRes.json()
      ]);

      // Extract data arrays from API response (handles both { data: [...] } and [...] formats)
      setTeams(teamData?.data || teamData || []);
      setIncomes(incomeData?.data || incomeData || []);
      setExpenses(expenseData?.data || expenseData || []);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate totals safely
  const getTeamTotals = (teamName) => {
    const teamIncome = incomes
      .filter(inc => inc?.teamName === teamName)
      .reduce((sum, inc) => sum + (inc?.amount ?? 0), 0);

    const teamExpenses = expenses
      .filter(exp => exp?.teamName === teamName)
      .reduce((sum, exp) => sum + (exp?.amount ?? 0), 0);

    return { income: teamIncome, expenses: teamExpenses };
  };

  const getTeamTransactions = (teamName) => {
    const teamIncomes = incomes.filter(inc => inc?.teamName === teamName);
    const teamExpenses = expenses.filter(exp => exp?.teamName === teamName);

    return { incomes: teamIncomes, expenses: teamExpenses };
  };

  // Team CRUD operations
  const handleAddTeam = async () => {
    if (!newTeam.teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName: newTeam.teamName }),
      });

      if (response.ok) {
        const result = await response.json();
        // Extract the team object from the data property
        setTeams(prev => [result.data, ...prev]);
        setShowAddTeamModal(false);
        setNewTeam({ teamName: '' });
      } else {
        alert('Failed to add team. Please try again.');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      alert('Failed to add team. Please try again.');
    }
  };

  // Income CRUD operations
  const handleEditIncome = async (updatedData) => {
    try {
      const response = await fetch(`/api/income/${selectedIncome._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const savedIncome = await response.json();
        setIncomes(prev => prev.map(inc => inc._id === selectedIncome._id ? savedIncome : inc));
        setShowEditIncomeModal(false);
        setSelectedIncome(null);
      } else {
        alert('Failed to update income. Please try again.');
      }
    } catch (error) {
      console.error('Error updating income:', error);
      alert('Failed to update income. Please try again.');
    }
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      const response = await fetch(`/api/income/${incomeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIncomes(prev => prev.filter(inc => inc._id !== incomeId));
      } else {
        alert('Failed to delete income. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete income. Please try again.');
    }
  };

  // Add Income handler
  const handleAddIncome = async (incomeData) => {
    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (response.ok) {
        const result = await response.json();
        const savedIncome = result.data;
        setIncomes(prev => [savedIncome, ...prev]);
        closeIncomeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add income. Please try again.');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Failed to add income. Please try again.');
    }
  };

  // Add Expense handler
  const handleAddExpense = async (expenseData) => {
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const result = await response.json();
        const savedExpense = result.data;
        setExpenses(prev => [savedExpense, ...prev]);
        closeExpenseModal();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add expense. Please try again.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  // Expense CRUD operations
  const handleEditExpense = async (updatedData) => {
    try {
      const response = await fetch(`/api/expense/${selectedExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const savedExpense = await response.json();
        setExpenses(prev => prev.map(exp => exp._id === selectedExpense._id ? savedExpense : exp));
        setShowEditExpenseModal(false);
        setSelectedExpense(null);
      } else {
        alert('Failed to update expense. Please try again.');
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
      } else {
        alert('Failed to delete expense. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      // Find the team to get its name before deleting
      const teamToDelete = teams.find(t => t._id === teamId);
      if (!teamToDelete) {
        alert('Team not found.');
        return;
      }

      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const teamName = teamToDelete.teamName;

        // CASCADE DELETE: Remove team and all related data from state
        setTeams(prev => prev.filter(team => team._id !== teamId));
        setIncomes(prev => prev.filter(inc => inc.teamName !== teamName));
        setExpenses(prev => prev.filter(exp => exp.teamName !== teamName));
        setExpandedCard(null); // Close any expanded card
      } else {
        alert('Failed to delete team. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  const toggleCard = (teamId) => {
    setExpandedCard(prevExpanded => {
      // If clicking the same card that's already expanded, close it
      if (prevExpanded === teamId) {
        return null;
      }
      // Otherwise, close any open card and open the clicked one
      return teamId;
    });
  };

  // Click outside to close all teams
  const handleBackgroundClick = () => {
    setExpandedCard(null);
  };

  const openDeleteModal = (item, type) => {
    setDeleteTarget({ item, type });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget?.type === 'income') {
      handleDeleteIncome(deleteTarget.item._id);
    } else if (deleteTarget?.type === 'expense') {
      handleDeleteExpense(deleteTarget.item._id);
    } else if (deleteTarget?.type === 'team') {
      handleDeleteTeam(deleteTarget.item._id);
    }
    setDeleteTarget(null);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <TeamsContainer>
        <LoadingText>Loading teams data...</LoadingText>
      </TeamsContainer>
    );
  }

  return (
    <TeamsContainer onClick={handleBackgroundClick}>
      <Header onClick={(e) => e.stopPropagation()}>
        <Title
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Teams & Finances
        </Title>
        <AddTeamButton
          onClick={() => setShowAddTeamModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          + Add Team
        </AddTeamButton>
      </Header>

      {teams.length === 0 ? (
        <EmptyState
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: '60px', fontSize: '1.2rem' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }}>📊</div>
          <div>No teams yet. Create your first team to get started!</div>
          <AddTeamButton
            onClick={() => setShowAddTeamModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginTop: '24px' }}
          >
            + Create Team
          </AddTeamButton>
        </EmptyState>
      ) : (
        <CardsGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onClick={(e) => e.stopPropagation()}
        >
          {teams
            .filter(team => team)
            .map((team, index) => {
              const teamName = team?.teamName ?? "Unnamed Team";
              const { income, expenses: exp } = getTeamTotals(teamName);
              const { incomes: teamIncomes, expenses: teamExpenses } = getTeamTransactions(teamName);
              const balance = income - exp;
              const isExpanded = expandedCard === team._id;
              const isActive = income > 0 || exp > 0;

              // Calculate balance percentage for visual bar
              const maxTotal = income + exp;
              const balancePercentage = maxTotal > 0 ? Math.abs(balance / maxTotal) * 100 : 0;

              return (
                <TeamCard
                  key={team._id ?? index}
                  variants={cardVariants}
                  expanded={isExpanded}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}
                      onClick={() => toggleCard(team._id)}
                    >
                      <TeamIcon>
                        {teamName.charAt(0).toUpperCase()}
                      </TeamIcon>
                      <div>
                        <TeamName>{teamName}</TeamName>
                        <StatusBadge active={isActive}>
                          {isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </div>
                    </div>
                    <HeaderActions>
                      <DeleteTeamButton
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(team, 'team');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete Team"
                      >
                        <FaTrash />
                      </DeleteTeamButton>
                      <ExpandIcon
                        onClick={() => toggleCard(team._id)}
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </ExpandIcon>
                    </HeaderActions>
                  </CardHeader>

                  <StatsRow>
                    <StatItem type="income">
                      <StatLabel type="income">Income</StatLabel>
                      <StatValue type="income">${income.toLocaleString()}</StatValue>
                    </StatItem>
                    <StatItem type="expense">
                      <StatLabel type="expense">Expenses</StatLabel>
                      <StatValue type="expense">${exp.toLocaleString()}</StatValue>
                    </StatItem>
                  </StatsRow>

                  <StatItem>
                    <StatLabel>Net Balance</StatLabel>
                    <StatValue style={{ color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                      ${Math.abs(balance).toLocaleString()} {balance >= 0 ? 'Surplus' : 'Deficit'}
                    </StatValue>
                  </StatItem>

                  <BalanceBar>
                    <BalanceFill
                      positive={balance >= 0}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(balancePercentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                    />
                  </BalanceBar>

                  <AnimatePresence mode="wait">
                    {isExpanded && expandedCard === team._id && (
                      <ExpandedContent
                        key={`expanded-${team._id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {/* Action Buttons */}
                        <ActionButtonsRow>
                          <ActionButton
                            className="income"
                            onClick={(e) => {
                              e.stopPropagation();
                              openIncomeModal(teamName);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>💰</span> Credit
                          </ActionButton>
                          <ActionButton
                            className="expense"
                            onClick={(e) => {
                              e.stopPropagation();
                              openExpenseModal(teamName);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>💸</span> Debit
                          </ActionButton>
                        </ActionButtonsRow>

                        {/* Income List */}
                        <TransactionsSection>
                          <SectionTitle>
                            <span>💰</span> Income Entries ({teamIncomes.length})
                          </SectionTitle>
                          <TransactionList>
                            {teamIncomes.length === 0 ? (
                              <EmptyState>No income entries yet</EmptyState>
                            ) : (
                              teamIncomes.map(income => (
                                <TransactionItem
                                  key={income._id}
                                  type="income"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <TransactionInfo>
                                    <TransactionTitle>{income.title}</TransactionTitle>
                                    <TransactionDetails>
                                      <span>{income.category}</span>
                                      <span>•</span>
                                      <span>{new Date(income.date).toLocaleDateString()}</span>
                                    </TransactionDetails>
                                  </TransactionInfo>
                                  <TransactionAmount type="income">
                                    +${income.amount.toLocaleString()}
                                  </TransactionAmount>
                                  <TransactionActions onClick={e => e.stopPropagation()}>
                                    <IconButton
                                      className="edit"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIncome(income);
                                        setShowEditIncomeModal(true);
                                      }}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      ✏️
                                    </IconButton>
                                    <IconButton
                                      className="delete"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(income, 'income');
                                      }}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      🗑️
                                    </IconButton>
                                  </TransactionActions>
                                </TransactionItem>
                              ))
                            )}
                          </TransactionList>
                        </TransactionsSection>

                        {/* Expense List */}
                        <TransactionsSection style={{ marginTop: '24px' }}>
                          <SectionTitle>
                            <span>💸</span> Expense Entries ({teamExpenses.length})
                          </SectionTitle>
                          <TransactionList>
                            {teamExpenses.length === 0 ? (
                              <EmptyState>No expense entries yet</EmptyState>
                            ) : (
                              teamExpenses.map(expense => (
                                <TransactionItem
                                  key={expense._id}
                                  type="expense"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <TransactionInfo>
                                    <TransactionTitle>{expense.title}</TransactionTitle>
                                    <TransactionDetails>
                                      <span>{expense.category}</span>
                                      <span>•</span>
                                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                                    </TransactionDetails>
                                  </TransactionInfo>
                                  <TransactionAmount type="expense">
                                    -${expense.amount.toLocaleString()}
                                  </TransactionAmount>
                                  <TransactionActions onClick={e => e.stopPropagation()}>
                                    <IconButton
                                      className="edit"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedExpense(expense);
                                        setShowEditExpenseModal(true);
                                      }}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      ✏️
                                    </IconButton>
                                    <IconButton
                                      className="delete"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openDeleteModal(expense, 'expense');
                                      }}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      🗑️
                                    </IconButton>
                                  </TransactionActions>
                                </TransactionItem>
                              ))
                            )}
                          </TransactionList>
                        </TransactionsSection>
                      </ExpandedContent>
                    )}
                  </AnimatePresence>
                </TeamCard>
              );
            })}
        </CardsGrid>
      )}

      {/* Add Team Modal */}
      <AnimatePresence mode="wait">
        {showAddTeamModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setShowAddTeamModal(false)}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <ModalTitle>Add New Team</ModalTitle>
              <Input
                type="text"
                placeholder="Team Name *"
                value={newTeam.teamName}
                onChange={e => setNewTeam({ ...newTeam, teamName: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddTeam()}
              />
              <ButtonGroup>
                <Button
                  className="secondary"
                  onClick={() => setShowAddTeamModal(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </Button>
                <Button
                  className="primary"
                  onClick={handleAddTeam}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Add Team
                </Button>
              </ButtonGroup>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Add Income Modal (Credit) */}
      <AddIncomeModal
        show={showIncomeModal}
        onClose={closeIncomeModal}
        onAddIncome={handleAddIncome}
        preselectedTeam={selectedTeam}
      />

      {/* Add Expense Modal (Debit) */}
      <AddExpenseModal
        show={showExpenseModal}
        onClose={closeExpenseModal}
        onAddExpense={handleAddExpense}
        preselectedTeam={selectedTeam}
      />

      {/* Edit Income Modal */}
      <EditIncomeModal
        show={showEditIncomeModal}
        onClose={() => {
          setShowEditIncomeModal(false);
          setSelectedIncome(null);
        }}
        onEditIncome={handleEditIncome}
        income={selectedIncome}
      />

      {/* Edit Expense Modal */}
      <EditExpenseModal
        show={showEditExpenseModal}
        onClose={() => {
          setShowEditExpenseModal(false);
          setSelectedExpense(null);
        }}
        onEditExpense={handleEditExpense}
        expense={selectedExpense}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.type === 'team' ? deleteTarget?.item?.teamName : deleteTarget?.item?.title}
        itemType={deleteTarget?.type === 'income' ? 'Income' : deleteTarget?.type === 'expense' ? 'Expense' : 'Team'}
      />
    </TeamsContainer>
  );
}
