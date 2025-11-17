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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler);

const ExpenseContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  background: ${darkTheme.background.primary};
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
    background: rgba(124, 92, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 92, 255, 0.5);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${darkTheme.text.primary};
`;

const InfoBanner = styled.div`
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.1) 0%, rgba(167, 139, 250, 0.08) 100%);
  border: 2px solid rgba(124, 92, 255, 0.2);
  border-radius: ${darkTheme.radius.md};
  padding: 14px 20px;
  color: ${darkTheme.accent.purple};
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '💡';
    font-size: 1.2rem;
  }
`;

const InfoText = styled.p`
  color: ${darkTheme.text.secondary};
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 20px;
`;

const ChartSection = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.xl};
  box-shadow: ${darkTheme.shadow.soft};
  margin-bottom: 30px;
  border: 1px solid ${darkTheme.border.light};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Subtle glow effect on hover - matching BarChart */
  &:hover {
    box-shadow: ${darkTheme.shadow.medium};
    transform: translateY(-2px);
    border-color: ${darkTheme.accent.purple};
  }

  /* Decorative gradient top border for premium feel - matching BarChart */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${darkTheme.accent.gradientPurple};
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
      const [expenseRes, teamRes] = await Promise.all([
        fetch('/api/expense'),
        fetch('/api/teams')
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
      console.error('Error fetching expense data:', error);
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
        label: 'Expenses',
        data: filteredExpenses.slice(0, 10).reverse().map(exp => exp.amount),
        borderColor: darkTheme.accent.purple,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(124, 92, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(124, 92, 255, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: darkTheme.accent.purple,
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
        <LoadingText>Loading expense data...</LoadingText>
      </ExpenseContainer>
    );
  }

  return (
    <ExpenseContainer>
      <Header>
        <div>
          <Title>Expense Overview</Title>
          <InfoText>Track your spending trends over time and gain insights into where your money goes</InfoText>
        </div>
        <InfoBanner>
          To add new expenses, go to Teams page and select a team
        </InfoBanner>
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
        title="All Expenses"
        transactions={filteredExpenses}
        onDeleteSuccess={(deletedId) =>
          setExpenses((prev) => prev.filter((tx) => tx._id !== deletedId))
        }
      />
    </ExpenseContainer>
  );
}
