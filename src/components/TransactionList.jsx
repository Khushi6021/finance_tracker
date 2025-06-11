import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import TransactionItem from './TransactionItem';
import styles from './TransactionList.module.css';

const TransactionList = ({ transactions, openEditModal }) => {
  const { deleteTransaction } = useTransaction();
  const [showTransactions, setShowTransactions] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleTransactions = () => setShowTransactions((prev) => !prev);

  const filteredTransactions =
    selectedCategory === 'All'
      ? transactions
      : transactions.filter(
          (transaction) => transaction.category === selectedCategory
        );

  return (
    <div className={styles.transactionListContainer}>
      <h2 className={styles.head}>Transactions List</h2>

      <div className={styles.topActions}>
        <button className={styles.toggleBtn} onClick={toggleTransactions}>
          {showTransactions ? 'Hide Transactions' : 'Show All Transactions'}
        </button>
      </div>

      {transactions.length > 0 && (
        <div className={styles.filterContainer}>
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.dropdown}
          >
            <option value="All">All</option>
            <option value="Food">Food</option>
            <option value="Billing">Billing</option>
            <option value="Travel">Travel</option>
            <option value="Other">Other</option>
          </select>
        </div>
      )}

      {filteredTransactions.length === 0 ? (
        <div className={styles.emptyMessage}>
          <h3>No transactions found in this category.</h3>
        </div>
      ) : (
        <div className={styles.section}>
          <h3 onClick={toggleTransactions} className={styles.sectionTitle}>
            Transactions {showTransactions ? '▲' : '▼'}
          </h3>
          {showTransactions && (
            <div className={styles.transactionItems}>
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction._id}
                  transaction={transaction}
                  openEditModal={openEditModal}
                  deleteTransaction={() => deleteTransaction(transaction._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
