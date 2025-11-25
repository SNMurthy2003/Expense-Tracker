'use client';

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import InfoCard from "@/components/InfoCard";
import Transactions from "@/components/Transactions";
import AllTeamsDropdown from "@/components/AllTeamsDropdown";

// Dynamically import heavy chart component
const DoughnutChart = dynamic(() => import("@/components/DoughnutChart"), {
  ssr: false,
  loading: () => <div style={{ textAlign: 'center', padding: '20px', color: '#8b8b8b' }}>Loading chart...</div>
});
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaBriefcase,
  FaPiggyBank,
  FaShopify,
  FaUtensils,
  FaCar,
  FaFilm,
  FaLightbulb,
  FaHospital,
  FaShoppingBag
} from "react-icons/fa";
import { darkTheme } from "@/styles/darkTheme";
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Helper to get auth headers with user ID
const getAuthHeaders = () => {
  const user = auth.currentUser;
  return {
    'Content-Type': 'application/json',
    ...(user && { 'x-user-id': user.uid })
  };
};

// --- Styled Components ---
const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  background: ${darkTheme.background.primary};
  font-family: ${darkTheme.font.primary};
  position: relative;
  /* REMOVED: overflow-y: auto - This was clipping the dropdown menu */

  /* Purple ambient glow effects */
  &::before {
    content: '';
    position: fixed;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(176, 101, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: float 20s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -30%;
    left: 240px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: float 25s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, -30px) scale(1.05); }
  }

  /* Ensure dropdown has higher z-index than all content */
  & > *:not([data-dropdown]) {
    position: relative;
    z-index: 1;
  }

  & > [data-dropdown],
  & [data-dropdown="true"] {
    position: relative;
    z-index: 999999 !important;
  }
`;

const InfoCardsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
  animation: slideUp 0.6s ease-out 0.1s both;
  position: relative;
  z-index: 1;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  animation: slideUp 0.6s ease-out 0.3s both;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingText = styled.p`
  text-align: center;
  color: ${darkTheme.text.secondary};
  font-size: 1.1rem;
  margin-top: 50px;
  font-family: ${darkTheme.font.primary};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default function DashboardPage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);

  // Icon functions
  const getIncomeIcon = (category) => {
    const iconMap = {
      Salary: FaDollarSign,
      Freelance: FaBriefcase,
      Investment: FaPiggyBank,
      Business: FaShopify,
      Other: FaDollarSign,
    };
    return iconMap[category] || FaDollarSign;
  };

  const getExpenseIcon = (category) => {
    const iconMap = {
      Food: FaUtensils,
      Transport: FaCar,
      Entertainment: FaFilm,
      Utilities: FaLightbulb,
      Healthcare: FaHospital,
      Shopping: FaShoppingBag,
      Groceries: FaShoppingBag,
      Other: FaShoppingBag,
    };
    return iconMap[category] || FaShoppingBag;
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [incomeRes, expenseRes, teamRes] = await Promise.all([
        fetch('/api/income', { headers }),
        fetch('/api/expense', { headers }),
        fetch('/api/teams', { headers }),
      ]);

      const [incomeData, expenseData, teamData] = await Promise.all([
        incomeRes.json(),
        expenseRes.json(),
        teamRes.json(),
      ]);

      // Extract data arrays
      const incomes = incomeData.data || incomeData || [];
      const exps = expenseData.data || expenseData || [];
      const tms = teamData.data || teamData || [];

      // Map income data with icons
      const mappedIncome = incomes.map(item => ({
        ...item,
        name: item.title,
        type: 'income',
        date: new Date(item.date),
        icon: getIncomeIcon(item.category),
      }));

      // Map expense data with icons
      const mappedExpenses = exps.map(item => ({
        ...item,
        name: item.title,
        type: 'expense',
        date: new Date(item.date),
        icon: getExpenseIcon(item.category),
      }));

      setIncome(mappedIncome);
      setExpenses(mappedExpenses);
      setTeams(tms);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for Firebase auth to be ready before fetching data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter by selected team
  const filteredIncome = selectedTeam
    ? income.filter(i => i.teamName === selectedTeam)
    : income;

  const filteredExpenses = selectedTeam
    ? expenses.filter(e => e.teamName === selectedTeam)
    : expenses;

  // Totals
  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Merge transactions and sort by date descending
  const recentTransactions = [...filteredIncome, ...filteredExpenses]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5) // show latest 5 transactions
    .map(tx => ({
      ...tx,
      dateFormatted: tx.date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }));

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingText>Loading Dashboard...</LoadingText>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Team Dropdown - Moved to right with spacing */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginRight: '20px', position: 'relative', zIndex: 1000000 }}>
        <div style={{ width: '140px', position: 'relative', zIndex: 1000000 }}>
          <AllTeamsDropdown
            teams={teams}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
          />
        </div>
      </div>

      {/* Info Cards */}
      <InfoCardsRow>
        <InfoCard
          title="Total Balance"
          amount={`${totalBalance.toLocaleString()}`}
          type="balance"
          icon={FaWallet}
        />
        <InfoCard
          title="Total Credit"
          amount={`${totalIncome.toLocaleString()}`}
          type="income"
          icon={FaArrowUp}
        />
        <InfoCard
          title="Total Debit"
          amount={`${totalExpenses.toLocaleString()}`}
          type="expense"
          icon={FaArrowDown}
        />
      </InfoCardsRow>

      {/* Charts */}
      <OverviewGrid>
        <Transactions
          income={filteredIncome}
          expenses={filteredExpenses}
          recentTransactions={recentTransactions}
        />
        <DoughnutChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
      </OverviewGrid>
    </DashboardContainer>
  );
}