'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaShoppingBag, FaPlane, FaLightbulb, FaUtensils, FaCar, FaFilm, FaHospital } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import TransactionListCard from '@/components/TransactionListCard';
import AllTeamsDropdown from '@/components/AllTeamsDropdown';
import { darkTheme } from '@/styles/darkTheme';
import { auth } from '@/firebase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler);

// Helper to get auth headers with user ID
const getAuthHeaders = () => {
  const user = auth.currentUser;
  return {
    'Content-Type': 'application/json',
    ...(user && { 'x-user-id': user.uid })
  };
};

const ExpenseContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  background: ${darkTheme.background.primary};
  font-family: ${darkTheme.font.primary};
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar styling */
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #b065ff 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: ${darkTheme.font.primary};
  letter-spacing: -0.5px;
  transition: all ${darkTheme.transition.normal};
  cursor: default;
  position: relative;
  display: inline-block;

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(176, 101, 255, 0.5));
  }
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, rgba(176, 101, 255, 0.1) 0%, rgba(124, 58, 237, 0.08) 100%);
  border: 1px solid rgba(176, 101, 255, 0.3);
  border-radius: ${darkTheme.radius.md};
  padding: 14px 20px;
  color: ${darkTheme.brand.primary};
  font-weight: 600;
  font-size: 0.9rem;
  font-family: ${darkTheme.font.primary};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all ${darkTheme.transition.normal};

  &:hover {
    border-color: ${darkTheme.brand.primary};
    box-shadow: ${darkTheme.shadow.glow};
  }

  &::before {
    content: '💡';
    font-size: 1.2rem;
  }
`;

const InfoText = styled.p`
  color: ${darkTheme.text.secondary};
  font-size: 0.9rem;
  font-family: ${darkTheme.font.primary};
  margin-top: 5px;
  margin-bottom: 20px;
`;

const ChartSection = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.md};
  box-shadow: ${darkTheme.shadow.cardShadow};
  margin-bottom: 30px;
  border: 1px solid ${darkTheme.border.card};
  transition: all ${darkTheme.transition.normal};
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;

  &:hover {
    box-shadow: ${darkTheme.shadow.glow};
    border-color: ${darkTheme.border.accent};
  }
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Subtle glow effect on hover - matching BarChart */
  &:hover {
    box-shadow: ${darkTheme.shadow.medium};
    transform: translateY(-2px);
    border-color: ${darkTheme.brand.primary};
  }

  /* Decorative gradient top border for premium feel - matching BarChart */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${darkTheme.brand.gradient};
    opacity: 0.8;
    box-shadow: 0 0 20px rgba(124, 92, 255, 0.3);
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${darkTheme.text.secondary};
  font-size: 1rem;
  margin-top: 50px;
`;

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch data from MongoDB
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [expenseRes, teamRes] = await Promise.all([
        fetch('/api/expense', { headers }),
        fetch('/api/teams', { headers })
      ]);

      const [expenseData, teamData] = await Promise.all([
        expenseRes.json(),
        teamRes.json()
      ]);

      // Extract data arrays (handles both { data: [...] } and [...] formats)
      const expenses = expenseData?.data || expenseData || [];
      const teams = teamData?.data || teamData || [];

      // Map backend data to frontend format with icons
      const mappedExpenses = expenses.map(item => ({
        ...item,
        name: item.title,
        type: 'expense',
        icon: getIconForCategory(item.category)
      }));

      setExpenses(mappedExpenses);
      setTeams(teams);
    } catch (error) {
      console.error('Error fetching debit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get icon based on category
  const getIconForCategory = (category) => {
    const iconMap = {
      'Food': FaUtensils,
      'Transport': FaCar,
      'Entertainment': FaFilm,
      'Utilities': FaLightbulb,
      'Healthcare': FaHospital,
      'Shopping': FaShoppingBag,
      'Groceries': FaShoppingBag,
      'Other': FaShoppingBag
    };
    return iconMap[category] || FaShoppingBag;
  };

  const filteredExpenses = selectedTeam
    ? expenses.filter(exp => exp.teamName === selectedTeam)
    : expenses;

  // --- Line chart data ---
  const data = {
    labels: filteredExpenses.slice(0, 10).reverse().map(exp =>
      new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Debits',
        data: filteredExpenses.slice(0, 10).reverse().map(exp => exp.amount),
        borderColor: darkTheme.brand.primary,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(124, 92, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(124, 92, 255, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: darkTheme.brand.primary,
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
          x: { grid: { display: false, color: darkTheme.chart.grid }, ticks: { color: darkTheme.chart.text, font: { size: 13, weight: 500 } } },
          y: { beginAtZero: true, grid: { color: darkTheme.chart.grid }, ticks: { color: darkTheme.chart.text, font: { size: 13, weight: 500 } } },
      },
  };

  if (loading) {
    return (
      <ExpenseContainer>
        <LoadingText>Loading debit data...</LoadingText>
      </ExpenseContainer>
    );
  }

  return (
    <ExpenseContainer>
      <Header>
        <div></div>
        <Title>Debit</Title>
      </Header>

      {/* Team Dropdown */}
      <AllTeamsDropdown
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
      />

      <ChartSection>
        <Line data={data} options={options} />
      </ChartSection>

      {/* Integrated delete success callback */}
      <TransactionListCard
        title="All Debits"
        transactions={filteredExpenses}
        onDeleteSuccess={(deletedId) =>
          setExpenses((prev) => prev.filter((tx) => tx._id !== deletedId))
        }
      />
    </ExpenseContainer>
  );
}
