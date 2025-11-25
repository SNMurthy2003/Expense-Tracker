'use client';

import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

// Helper to notify parent window (Zeminent) when popup opens/closes
const notifyParent = (type) => {
  if (typeof window !== 'undefined' && window.parent !== window) {
    window.parent.postMessage({ type }, '*');
  }
};

export const ModalProvider = ({ children }) => {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const openIncomeModal = (teamName) => {
    setSelectedTeam(teamName);
    setShowIncomeModal(true);
    notifyParent('POPUP_OPENED');
  };

  const closeIncomeModal = () => {
    setShowIncomeModal(false);
    setSelectedTeam(null);
    notifyParent('POPUP_CLOSED');
  };

  const openExpenseModal = (teamName) => {
    setSelectedTeam(teamName);
    setShowExpenseModal(true);
    notifyParent('POPUP_OPENED');
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setSelectedTeam(null);
    notifyParent('POPUP_CLOSED');
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
