import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => {
  return useContext(TransactionContext);
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from backend API
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions'); // Adjust your API base URL & endpoint
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
      const res = await fetch('http://localhost:5000/api/transactions', {
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

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/transactions/${updatedTransaction.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTransaction),
        }
      );
      if (!res.ok) throw new Error('Failed to update transaction');
      const updated = await res.json();
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === updated.id ? updated : tx))
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
