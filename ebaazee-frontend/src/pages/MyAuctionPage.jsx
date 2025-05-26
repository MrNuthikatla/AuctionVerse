import React, { useState } from 'react';
import auctionsData from '../data/MyAuctionsData.json';
import styles from '../css/MyAuctionPage.module.css';

const TABS = [
  { key: 'inProgress', label: 'In-Progress Bids' },
  { key: 'won',        label: 'Won Bids'         },
  { key: 'closed',     label: 'Closed Bids'      },
  { key: 'all',        label: 'All'              }
];

export default function MyAuctionsPage() {
  const [activeTab, setActiveTab] = useState('inProgress');

  // Merge inProgress, won, closed—tagging each item with its type
  const inProgressWithType = auctionsData.inProgress.map(item => ({
    ...item,
    type: 'inProgress'
  }));
  const wonWithType       = auctionsData.won.map(item => ({
    ...item,
    type: 'won'
  }));
  const closedWithType    = auctionsData.closed.map(item => ({
    ...item,
    type: 'closed'
  }));

  const allCards = [
    ...inProgressWithType,
    ...wonWithType,
    ...closedWithType
  ];

  // pick the right array
  const cards =
    activeTab === 'all'
      ? allCards
      : activeTab === 'inProgress'
      ? inProgressWithType
      : activeTab === 'won'
      ? wonWithType
      : closedWithType;

  // helper for button text
  const buttonText = type => {
    switch (type) {
      case 'inProgress':
        return 'Checkout';
      case 'won':
        return 'View';
      case 'closed':
        return 'View';
      default:
        return 'View';
    }
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>My Auctions</h1>

      <nav className={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`${styles.tabButton} ${
              tab.key === activeTab ? styles.active : ''
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.cardsGrid}>
        {cards.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={item.image}
                alt={item.title}
                className={styles.cardImage}
              />
              {item.type === 'inProgress' && (
                <span className={styles.badgeLive}>Active</span>
              )}
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <div className={styles.bidInfo}>
              Current Bid at:{' '}
              <strong>${item.currentBid.toLocaleString()}</strong>
            </div>
            <button className={styles.bidButton}>
              {buttonText(item.type)}
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <p className={styles.emptyMessage}>No items in this category.</p>
        )}
      </div>
    </div>
  );
}
