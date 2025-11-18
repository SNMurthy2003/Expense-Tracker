'use client';

// src/components/Transactions.js
import React from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import { darkTheme } from '@/styles/darkTheme';

const TransactionList = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.md};
  box-shadow: ${darkTheme.shadow.cardShadow};
  border: 1px solid ${darkTheme.border.card};
  transition: all ${darkTheme.transition.normal};
  font-family: ${darkTheme.font.primary};

  &:hover {
    box-shadow: ${darkTheme.shadow.glow};
    border-color: ${darkTheme.border.accent};
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${darkTheme.border.card};
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${darkTheme.text.primary};
  font-family: ${darkTheme.font.primary};
`;

const SeeAll = styled.a`
  color: ${darkTheme.brand.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all ${darkTheme.transition.normal};
  padding: 6px 12px;
  border-radius: ${darkTheme.radius.sm};
  font-family: ${darkTheme.font.primary};

  &:hover {
    background: rgba(176, 101, 255, 0.1);
    color: ${darkTheme.brand.primaryHover};
    transform: translateX(2px);
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${darkTheme.border.card};
  transition: all ${darkTheme.transition.normal};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(176, 101, 255, 0.05);
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    border-radius: ${darkTheme.radius.md};
  }
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
`;

const IconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${darkTheme.radius.md};
  background: rgba(176, 101, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  margin-right: 15px;
  color: ${darkTheme.brand.primary};
  border: 1px solid rgba(176, 101, 255, 0.2);
  transition: all ${darkTheme.transition.normal};

  ${Item}:hover & {
    transform: scale(1.05);
    background: rgba(176, 101, 255, 0.15);
    border-color: ${darkTheme.brand.primary};
  }
`;

const NameDate = styled.div`
  p {
    margin: 0;
  }
  .name {
    font-weight: 600;
    color: ${darkTheme.text.primary};
    font-size: 0.95rem;
  }
  .date {
    font-size: 0.82rem;
    color: ${darkTheme.text.secondary};
    margin-top: 2px;
  }
`;

const Amount = styled.p`
  font-weight: 700;
  font-size: 1.05rem;
  color: ${(props) =>
    props.type === 'income' ? darkTheme.chart.income : darkTheme.chart.expense};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrashButton = styled.button`
  background: none;
  border: none;
  color: ${darkTheme.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px;
  border-radius: ${darkTheme.radius.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${darkTheme.status.error};
    background: rgba(239, 68, 68, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Transactions = ({ income = [], expenses = [] }) => {
  // Merge income and expense, then sort by date descending
  const combined = [...income, ...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Limit to latest 5 transactions
  const recentTransactions = combined.slice(0, 5);

  if (!recentTransactions.length) return <p>No recent transactions</p>;

  return (
    <TransactionList>
      <ListHeader>
        <Title>Recent Transactions</Title>
        <SeeAll href="#">See All →</SeeAll>
      </ListHeader>
      {recentTransactions.map((tx) => {
        const IconComponent = tx.icon;
        return (
          <Item key={tx._id || tx.name + tx.date}>
            <Detail>
              <IconBox>{IconComponent && <IconComponent />}</IconBox>
              <NameDate>
                <p className="name">{tx.name}</p>
                <p className="date">{new Date(tx.date).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}</p>
              </NameDate>
            </Detail>
            <Amount type={tx.type}>
              {tx.type === 'income' ? '+' : '-'} ${Math.abs(tx.amount).toLocaleString()}
              <TrashButton>
                <FaTrash />
              </TrashButton>
            </Amount>
          </Item>
        );
      })}
    </TransactionList>
  );
};

export default Transactions;
