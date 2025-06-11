import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => {
  return useContext(TransactionContext);
};

// ✅ Hardcoded API base URL instead of .env
const API_BASE_URL = 'https://finance-tracker-backend-1.onrender.com';

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      const newTransaction = await res.json();
      setTransactions((prev) => [...prev, newTransaction]);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const deleteTransaction = async (_id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions((prev) => prev.filter((tx) => tx._id !== _id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions/${updatedTransaction._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTransaction),
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      const updated = await res.json();
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === updated._id ? updated : tx))
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const getFilteredTransactions = (type) => {
    if (type === 'credit') {
      return transactions.filter((tx) => tx.type.toLowerCase() === 'credit');
    } else if (type === 'debit') {
      return transactions.filter((tx) => tx.type.toLowerCase() === 'debit');
    }
    return transactions;
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        getFilteredTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
