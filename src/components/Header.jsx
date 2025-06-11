import React from 'react';
import { Link } from 'react-router-dom'; 
import styles from './Header.module.css';

const Header = ({ balance, totalCredit, totalDebit }) => {
  return (
    <div>
      <header className={styles.header}>
        <h1> Finance Tracker</h1>
        <h2>Total Balance Available: <span>₹{balance}</span></h2>

        <div className={styles.transactionSummary}>
          <Link to="/credit" className={styles.summaryButton}>
            Credited: ₹{totalCredit}
          </Link>
          <Link to="/debit" className={styles.summaryButton}>
            Debited: ₹{totalDebit}
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Header;
