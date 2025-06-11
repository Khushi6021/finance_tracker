import React, { useState } from 'react';
import styles from './TransactionItem.module.css';

const TransactionItem = ({ transaction, openEditModal, deleteTransaction }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded);
  };

  const isDescriptionLong = transaction.description?.length > 30;

  return (
    <div className={styles.transactionItem}>
      <div className={styles.transactionDetails}>
        <span className={styles.transactionAmount}>
          {transaction.type}: ₹{transaction.amount}
        </span>

        <span className={styles.transactionCategory}>
          Category: {transaction.category}
        </span>

        <span className={styles.transactionDescription}>
          {isDescriptionExpanded || !isDescriptionLong
            ? transaction.description
            : `${transaction.description.slice(0, 30)}...`}
          {isDescriptionLong && (
            <span className={styles.readMore} onClick={toggleDescription}>
              {isDescriptionExpanded ? ' Read Less' : ' Read More'}
            </span>
          )}
        </span>
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => openEditModal(transaction)}
          className={styles.editButton}
        >
          Edit
        </button>

        {/* Use _id instead of id for MongoDB */}
        <button
          onClick={() => deleteTransaction(transaction._id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
