import React, { useState } from 'react';
import styles from '../css/HelpAndSupportPage.module.css';

export default function HelpAndSupportPage() {
  const [query, setQuery] = useState('');
  const topics = [
    'How to place a bid',
    'Managing your account',
    'Payment methods',
    'Contact support',
    'FAQ',
    'Terms & Conditions'
  ].filter(t => t.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Help Topics"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Help & Support</h2>
        <ul className={styles.list}>
          {topics.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
