'use client';

import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const openIncomeModal = (teamName) => {
    setSelectedTeam(teamName);
    setShowIncomeModal(true);
  };

  const closeIncomeModal = () => {
    setShowIncomeModal(false);
    setSelectedTeam(null);
  };

  const openExpenseModal = (teamName) => {
    setSelectedTeam(teamName);
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setSelectedTeam(null);
  };

  return (
    <ModalContext.Provider
      value={{
        showIncomeModal,
        setShowIncomeModal,
        showExpenseModal,
        setShowExpenseModal,
        selectedTeam,
        setSelectedTeam,
        openIncomeModal,
        closeIncomeModal,
        openExpenseModal,
        closeExpenseModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
