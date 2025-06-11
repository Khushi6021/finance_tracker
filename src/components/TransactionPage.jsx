import React, { useState } from 'react';
import { useTransaction } from '../context/TransactionContext';
import Header from './Header';
import TransactionList from './TransactionList';
import TransactionModal from './TransactionModal';
import styles from './TransactionPage.module.css';

const TransactionPage = ({ view }) => {
  const { transactions } = useTransaction();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const filteredTransactions =
    view === 'all'
      ? transactions
      : transactions.filter((tx) =>
          view === 'credit' ? tx.type === 'Credit' : tx.type === 'Debit'
        );

  
  const netBalance = transactions.reduce((acc, tx) => {
    return tx.type === 'Credit' ? acc + Number(tx.amount) : acc - Number(tx.amount);
  }, 0);

  const totalCredit = transactions.filter((tx) => tx.type === 'Credit').reduce((acc, tx) => acc + Number(tx.amount), 0);
  const totalDebit = transactions.filter((tx) => tx.type === 'Debit').reduce((acc, tx) => acc + Number(tx.amount), 0);

  
  const openModal = () => {
    setEditTransaction(null); 
    setModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditTransaction(tx); 
    setModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Header balance={netBalance} totalCredit={totalCredit} totalDebit={totalDebit} />
      <button className={styles.addBtn} onClick={openModal}>+ Add Transaction</button>
      <TransactionList transactions={filteredTransactions} openEditModal={openEditModal} />
      <TransactionModal isOpen={modalOpen} closeModal={() => setModalOpen(false)} editable={editTransaction} />
    </div>
  );
};

export default TransactionPage;
