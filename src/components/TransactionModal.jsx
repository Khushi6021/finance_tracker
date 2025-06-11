import React, { useState, useEffect } from 'react';
import { useTransaction } from '../context/TransactionContext';
import styles from './TransactionModal.module.css';

const TransactionModal = ({ isOpen, closeModal, editable }) => {
  const { addTransaction, updateTransaction } = useTransaction();

  const [type, setType] = useState('Credit');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    if (editable) {
      setType(editable.type);
      setAmount(editable.amount.toString());
      setCategory(editable.category);
      setDescription(editable.description);
    } else {
      setType('Credit');
      setAmount('');
      setCategory('Food');
      setDescription('');
    }
  }, [editable, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      type,
      amount: Number(amount),
      category,
      description,
    };

    if (editable) {
      updateTransaction({ ...newTransaction, id: editable.id });
    } else {
      addTransaction(newTransaction);
    }

    closeModal();
  };

  const handleCancel = () => {
    setType('Credit');
    setAmount('');
    setCategory('Food');
    setDescription('');
    closeModal();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  const hasStartedTyping = amount.trim() !== '' || description.trim() !== '';
  const characterCount = description.length;

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2>{editable ? 'Edit Transaction' : 'Add Transaction'}</h2>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.leftPart}>
            <textarea
              placeholder="Add Description..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value.length <= 30
                    ? e.target.value
                    : e.target.value.slice(0, 30)
                )
              }
              className={styles.textarea}
            />
            <p
              style={{
                textAlign: 'right',
                marginTop: '4px',
                fontSize: '14px',
                color: characterCount >= 30 ? 'red' : 'gray',
              }}
            >
              {characterCount}
            </p>
          </div>

          <div className={styles.rightPart}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.input}
              required
              min="0"
              step="0.01"
            />

            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={`${styles.toggleButton} ${type === 'Credit' ? styles.active : ''}`}
                onClick={() => setType('Credit')}
              >
                Credit
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${type === 'Debit' ? styles.active : ''}`}
                onClick={() => setType('Debit')}
              >
                Debit
              </button>
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Billing">Billing</option>
              <option value="Other">Other</option>
            </select>

            {hasStartedTyping && (
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveBtn}>Save</button>
                <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
