
import React from 'react';
import { useTransaction } from '../context/TransactionContext';
import TransactionList from './TransactionList';

const ItemsPage = () => {
  const { transactions } = useTransaction(); 

  return (
    <div>
      <h1>All Transactions</h1>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default ItemsPage;
