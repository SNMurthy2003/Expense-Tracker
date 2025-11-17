// utils/api.js - Next.js API utilities using native fetch

// ==================== INCOME APIs ====================

export const getIncomes = async () => {
  try {
    const response = await fetch('/api/income');
    if (!response.ok) throw new Error('Failed to fetch incomes');
    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error('Error fetching incomes:', error);
    throw error;
  }
};

export const addIncome = async (incomeData) => {
  try {
    const response = await fetch('/api/income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    });

    if (!response.ok) throw new Error('Failed to add income');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
};

export const updateIncome = async (id, incomeData) => {
  try {
    const response = await fetch(`/api/income/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    });

    if (!response.ok) throw new Error('Failed to update income');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error updating income:', error);
    throw error;
  }
};

export const deleteIncome = async (id) => {
  try {
    const response = await fetch(`/api/income/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete income');
    return await response.json();
  } catch (error) {
    console.error('Error deleting income:', error);
    throw error;
  }
};

export const getTotalIncome = async () => {
  try {
    const response = await fetch('/api/income');
    if (!response.ok) throw new Error('Failed to fetch total income');
    const data = await response.json();
    const incomes = data.data || data || [];

    // Calculate total from all incomes
    const total = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
    return total;
  } catch (error) {
    console.error('Error fetching total income:', error);
    return 0;
  }
};

// ==================== EXPENSE APIs ====================

export const getExpenses = async () => {
  try {
    const response = await fetch('/api/expense');
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await fetch('/api/expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) throw new Error('Failed to add expense');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await fetch(`/api/expense/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) throw new Error('Failed to update expense');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await fetch(`/api/expense/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete expense');
    return await response.json();
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const getTotalExpenses = async () => {
  try {
    const response = await fetch('/api/expense');
    if (!response.ok) throw new Error('Failed to fetch total expenses');
    const data = await response.json();
    const expenses = data.data || data || [];

    // Calculate total from all expenses
    const total = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    return total;
  } catch (error) {
    console.error('Error fetching total expenses:', error);
    return 0;
  }
};

// ==================== TEAM APIs ====================

export const getTeams = async () => {
  try {
    const response = await fetch('/api/teams');
    if (!response.ok) throw new Error('Failed to fetch teams');
    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const addTeam = async (teamData) => {
  try {
    const response = await fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) throw new Error('Failed to add team');
    return await response.json();
  } catch (error) {
    console.error('Error adding team:', error);
    throw error;
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) throw new Error('Failed to update team');
    return await response.json();
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

export const deleteTeam = async (id) => {
  try {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete team');
    return await response.json();
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};
