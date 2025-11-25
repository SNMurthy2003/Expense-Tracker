'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BarChart from '@/components/BarChart';
import TransactionListCard from '@/components/TransactionListCard';
import AllTeamsDropdown from '@/components/AllTeamsDropdown';
import { FaBriefcase, FaPiggyBank, FaShopify, FaDollarSign } from 'react-icons/fa';
import { darkTheme } from '@/styles/darkTheme';
import { auth } from '@/firebase';

// Helper to get auth headers with user ID
const getAuthHeaders = () => {
  const user = auth.currentUser;
  return {
    'Content-Type': 'application/json',
    ...(user && { 'x-user-id': user.uid })
  };
};

const IncomeContainer = styled.div`
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
  position: relative;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #2dd4bf 0%, #10b981 100%);
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
    filter: drop-shadow(0 0 20px rgba(45, 212, 191, 0.5));
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

const LoadingText = styled.p`
  text-align: center;
  color: ${darkTheme.text.secondary};
  font-size: 1rem;
  font-family: ${darkTheme.font.primary};
  margin-top: 50px;
`;

export default function IncomePage() {
  const [incomeSources, setIncomeSources] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);

  // Trigger to refresh chart when data changes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data from MongoDB
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [incomeRes, teamRes] = await Promise.all([
        fetch('/api/income', { headers }),
        fetch('/api/teams', { headers })
      ]);

      const [incomeData, teamData] = await Promise.all([
        incomeRes.json(),
        teamRes.json()
      ]);

      // Extract data arrays (handles both { data: [...] } and [...] formats)
      const incomes = incomeData?.data || incomeData || [];
      const teams = teamData?.data || teamData || [];

      // Map backend data to frontend format with icons
      const mappedIncome = incomes.map(item => ({
        ...item,
        name: item.title,
        type: 'income',
        icon: getIconForCategory(item.category)
      }));

      setIncomeSources(mappedIncome);
      setTeams(teams);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Get icon based on category
  const getIconForCategory = (category) => {
    const iconMap = {
      'Salary': FaDollarSign,
      'Freelance': FaBriefcase,
      'Investment': FaPiggyBank,
      'Business': FaShopify,
      'Other': FaDollarSign
    };
    return iconMap[category] || FaDollarSign;
  };

  const filteredIncome = selectedTeam
    ? incomeSources.filter(inc => inc.teamName === selectedTeam)
    : incomeSources;

  if (loading) {
    return (
      <IncomeContainer>
        <LoadingText>Loading credit data...</LoadingText>
      </IncomeContainer>
    );
  }

  return (
    <IncomeContainer>
      <Header>
        <div></div>
        <Title>Credit</Title>
      </Header>

      {/* Team Dropdown */}
      <AllTeamsDropdown
        teams={teams}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
      />

      {/* Pass refreshTrigger to BarChart */}
      <BarChart title="Credit Overview" data={filteredIncome} refreshTrigger={refreshTrigger} />

      {/* Integrated delete success callback */}
      <TransactionListCard
        title="Credit Sources"
        transactions={filteredIncome}
        onDeleteSuccess={(deletedId) =>
          setIncomeSources((prev) => prev.filter((tx) => tx._id !== deletedId))
        }
      />
    </IncomeContainer>
  );
}
