'use client';

// src/components/TransactionListCard.js
import React from 'react';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';
import * as api from '@/utils/api'; // Ensure you have deleteIncome & deleteExpense defined here
import { darkTheme } from '@/styles/darkTheme';

const ListCardWrapper = styled.div`
  background: ${darkTheme.background.panel};
  padding: 20px;
  border-radius: ${darkTheme.radius.lg};
  box-shadow: ${darkTheme.shadow.soft};
  margin-top: 30px;
  border: 1px solid ${darkTheme.border.light};
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${darkTheme.text.primary};
`;

const DownloadButton = styled.button`
  background: none;
  border: 1px solid ${darkTheme.border.medium};
  color: ${darkTheme.text.primary};
  padding: 8px 15px;
  border-radius: ${darkTheme.radius.sm};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${darkTheme.background.glass};
    border-color: ${darkTheme.accent.cyan};
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${darkTheme.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${darkTheme.radius.sm};
  background: ${darkTheme.background.glass};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  margin-right: 15px;
  color: ${darkTheme.accent.cyan};
`;

const NameDate = styled.div`
  p {
    margin: 0;
  }
  .name {
    font-weight: 500;
    color: ${darkTheme.text.primary};
  }
  .date {
    font-size: 0.8rem;
    color: ${darkTheme.text.secondary};
  }
`;

const AmountAndDelete = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Amount = styled.p`
  font-weight: 600;
  color: ${(props) =>
    props.type === 'income' ? darkTheme.chart.income : darkTheme.chart.expense};
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${darkTheme.text.secondary};
  cursor: pointer;
  font-size: 1rem;
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

const TransactionListCard = ({ title, transactions = [], showDownload = true, onDeleteSuccess }) => {
  // ✅ Handle delete logic
  const handleDelete = async (tx) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${tx.name}"?`);
    if (!confirmDelete) return;

    try {
      if (tx.type === 'income') {
        await api.deleteIncome(tx._id);
      } else if (tx.type === 'expense') {
        await api.deleteExpense(tx._id);
      }

      // Update parent list
      onDeleteSuccess && onDeleteSuccess(tx._id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  return (
    <ListCardWrapper>
      <ListHeader>
        <Title>{title}</Title>
        {showDownload && <DownloadButton>Download</DownloadButton>}
      </ListHeader>

      {transactions.length === 0 ? (
        <p style={{ color: darkTheme.text.secondary, textAlign: 'center' }}>No transactions available</p>
      ) : (
        transactions.map((tx, index) => {
          const IconComponent = tx.icon;
          return (
            <Item key={tx._id || index}>
              <Detail>
                <IconBox>{IconComponent && <IconComponent />}</IconBox>
                <NameDate>
                  <p className="name">{tx.name}</p>
                  <p className="date">{tx.date}</p>
                </NameDate>
              </Detail>
              <AmountAndDelete>
                <Amount type={tx.type}>
                  {tx.type === 'income' ? '+' : '-'} ${Math.abs(tx.amount).toLocaleString()}
                </Amount>
                <DeleteButton onClick={() => handleDelete(tx)}>
                  <FaTrashAlt />
                </DeleteButton>
              </AmountAndDelete>
            </Item>
          );
        })
      )}
    </ListCardWrapper>
  );
};

export default TransactionListCard;
