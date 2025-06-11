import React, { useState, useEffect } from 'react';
import './App.css';
import { TransactionProvider, useTransaction } from './context/TransactionContext';
import Header from './components/Header.jsx';
import TransactionList from './components/TransactionList.jsx';
import TransactionModal from './components/TransactionModal.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './styles/app.module.css';

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const TransactionPage = ({ view }) => {
  const { transactions, fetchTransactions } = useTransaction();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showBoth, setShowBoth] = useState(false);

  useEffect(() => {
    fetchTransactions(); // initial load

    const interval = setInterval(() => {
      fetchTransactions(); // reload every 5 seconds for dynamic updates
    }, 5000);

    return () => clearInterval(interval); // cleanup interval on unmount
  }, [fetchTransactions]);

  const normalizedView = capitalize(view);

  const filteredTransactions =
    normalizedView === 'All'
      ? transactions
      : transactions.filter((tx) => tx.type === normalizedView);

  const combinedTransactions = transactions.filter(
    (tx) => tx.type === 'Credit' || tx.type === 'Debit'
  );

  const netBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'Credit' ? acc + Number(tx.amount) : acc - Number(tx.amount);
  }, 0);

  const totalCredit = transactions
    .filter((tx) => tx.type === 'Credit')
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const totalDebit = transactions
    .filter((tx) => tx.type === 'Debit')
    .reduce((acc, tx) => acc + Number(tx.amount), 0);

  const openModal = () => {
    setEditTransaction(null);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const openEditModal = (tx) => {
    setEditTransaction(tx);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleShowBoth = () => {
    setShowBoth(!showBoth);
  };

  const isTransactionListEmpty = filteredTransactions.length === 0;

  return (
    <div className={styles.container}>
      <Header balance={netBalance} totalCredit={totalCredit} totalDebit={totalDebit} />

      <button className={styles.addBtn} onClick={openModal}>
        + Add Transaction
      </button>

      {isTransactionListEmpty ? (
        <div className={styles.summaryBox}>
          <blockquote>
            <p>""Track. Save. Grow.""</p>
          
          </blockquote>
        </div>
      ) : (
        <>
          <div className={styles.buttonGroup}>
            <button className={styles.toggleBtn} onClick={toggleShowBoth}>
              {showBoth ? 'Show Credit/Debit Separately' : 'Show All Transactions'}
            </button>
          </div>

          <div className={styles.listWrapper}>
            <div className={styles.listContent}>
              <TransactionList
                transactions={showBoth ? combinedTransactions : filteredTransactions}
                openEditModal={openEditModal}
              />
            </div>
          </div>
        </>
      )}

      <TransactionModal isOpen={modalOpen} closeModal={closeModal} editable={editTransaction} />
    </div>
  );
};

const App = () => {
  return (
    <TransactionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TransactionPage view="all" />} />
          <Route path="/credit" element={<TransactionPage view="credit" />} />
          <Route path="/debit" element={<TransactionPage view="debit" />} />
        </Routes>
      </Router>
    </TransactionProvider>
  );
};

export default App;
