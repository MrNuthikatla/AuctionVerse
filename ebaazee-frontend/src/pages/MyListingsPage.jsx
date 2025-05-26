// src/pages/MyListingsPage.jsx
import React, { useEffect, useState } from 'react';
import styles from '../css/MyListingsPage.module.css';

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings([
      { id: 1, title: 'Vintage Car Model', status: 'ACTIVE' },
      { id: 2, title: 'Antique Vase', status: 'SOLD' },
    ]);
  }, []);

  return (
    <div>
      <h1>My Listings</h1>
      <ul className={styles.list}>
        {listings.map(l => (
          <li key={l.id} className={styles.item}>
            {l.title} — <em>{l.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
