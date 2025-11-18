'use client';

// src/components/DoughnutChart.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTotalIncome, getTotalExpenses } from '@/utils/api';
import { darkTheme } from '@/styles/darkTheme';

const ChartContainer = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.md};
  box-shadow: ${darkTheme.shadow.cardShadow};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  border: 1px solid ${darkTheme.border.card};
  transition: all ${darkTheme.transition.normal};
  font-family: ${darkTheme.font.primary};

  &:hover {
    box-shadow: ${darkTheme.shadow.glow};
    border-color: ${darkTheme.border.accent};
  }
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  align-self: flex-start;
  color: ${darkTheme.text.primary};
  font-family: ${darkTheme.font.primary};
`;

const ChartVisual = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
  box-shadow: ${darkTheme.shadow.medium};

  &:hover {
    transform: scale(1.03);
  }

  &::after {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    background: ${darkTheme.background.panel};
    border-radius: 50%;
    box-shadow: ${darkTheme.shadow.inner};
  }
`;

const CenterText = styled.div`
  position: absolute;
  z-index: 2;
  text-align: center;

  p {
    color: ${darkTheme.text.secondary};
    font-size: 0.88rem;
    font-weight: 500;
    margin-bottom: 4px;
  }
  h4 {
    font-size: 1.7rem;
    font-weight: 700;
    color: ${darkTheme.text.primary};
  }
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
  font-size: 0.88rem;
  width: 100%;

  span {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: ${darkTheme.radius.sm};
    background: rgba(255, 255, 255, 0.05);
    transition: all ${darkTheme.transition.normal};
    color: ${darkTheme.text.secondary};
    font-family: ${darkTheme.font.primary};

    &:hover {
      background: rgba(176, 101, 255, 0.1);
      border: 1px solid ${darkTheme.border.accent};
      transform: translateX(4px);
    }
  }

  .expense-dot { color: ${darkTheme.brand.primary}; }
  .balance-dot { color: ${darkTheme.brand.accent}; }
  .income-dot { color: ${darkTheme.chart.income}; }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
  }
`;

const DoughnutChart = ({ refreshTrigger }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Fetch totals from backend dynamically
  const fetchTotals = async () => {
    try {
      const income = await getTotalIncome();
      const expenses = await getTotalExpenses();
      setTotalIncome(income || 0);
      setTotalExpenses(expenses || 0);
      setTotalBalance((income || 0) - (expenses || 0));
    } catch (err) {
      console.error('Error loading chart totals:', err);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, [refreshTrigger]); // Refresh every time income/expense data changes

  const total = totalIncome + totalExpenses + Math.abs(totalBalance);
  const expensePercent = total ? (totalExpenses / total) * 100 : 0;
  const incomePercent = total ? (totalIncome / total) * 100 : 0;
  const balancePercent = 100 - expensePercent - incomePercent;

  const chartBackground = {
    background: `conic-gradient(
      ${darkTheme.brand.primary} 0% ${expensePercent}%,
      ${darkTheme.brand.accent} ${expensePercent}% ${expensePercent + balancePercent}%,
      ${darkTheme.chart.income} ${expensePercent + balancePercent}% 100%
    )`
  };

  return (
    <ChartContainer>
      <Title>Financial Overview</Title>
      <ChartVisual style={chartBackground}>
        <CenterText>
          <p>Total Balance</p>
          <h4>${totalBalance.toLocaleString()}</h4>
        </CenterText>
      </ChartVisual>
      <Legend>
        <span>
          <div className="dot expense-dot" style={{ backgroundColor: darkTheme.brand.primary }}></div>
          Total Expenses (${totalExpenses.toLocaleString()})
        </span>
        <span>
          <div className="dot balance-dot" style={{ backgroundColor: darkTheme.brand.accent }}></div>
          Total Balance (${totalBalance.toLocaleString()})
        </span>
        <span>
          <div className="dot income-dot" style={{ backgroundColor: darkTheme.chart.income }}></div>
          Total Income (${totalIncome.toLocaleString()})
        </span>
      </Legend>
    </ChartContainer>
  );
};

export default DoughnutChart;
