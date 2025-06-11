import React from 'react';
import styles from '../styles/App.module.css';

const categories = ["Food", "Travel", "Billing", "Others"];

const Filter = ({ setFilter }) => {
  return (
    <div className={styles.filter}>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
    </div>
  );
};

export default Filter;
