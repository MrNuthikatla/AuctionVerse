import React, { useState, useEffect } from 'react';
import styles from '../css/MyAuctionPage.module.css';
import { jwtDecode } from 'jwt-decode';

const TABS = [
  { key: 'inProgress', label: 'In-Progress Bids' },
  { key: 'won',        label: 'Won Bids'         },
  { key: 'closed',     label: 'Closed Bids'      },
  { key: 'all',        label: 'All'              }
];

export default function MyAuctionsPage() {
  const [activeTab, setActiveTab] = useState('inProgress');
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId || decoded.id || decoded.sub);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !userId) return;
    setLoading(true);
    fetch('http://localhost:9090/api/user/my-bids', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(res => {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(data => {
          setBids(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
  }, [userId]);

  const now = new Date();

  const classifyBids = (bids) => {
    console.log(bids)
    if (!userId) return { inProgress: [], won: [], closed: [], all: [] };
    return {
      inProgress: bids.filter(
          bid =>
              !bid.isSold &&
              bid.endTime &&
              new Date(bid.endTime) > now
      ),
      won: bids.filter(
          bid =>
              bid.isSold &&
              bid.buyerId === userId
      ),
      closed: bids.filter(
          bid =>
              bid.isSold &&
              bid.buyerId !== userId
      ),
      all: bids
    };
  };

  const classified = classifyBids(bids);
  const cards = classified[activeTab] || [];

  const buttonText = (tab) => {
    switch (tab) {
      case 'inProgress': return 'Checkout';
      case 'won':        return 'View';
      case 'closed':     return 'View';
      default:           return 'View';
    }
  };

  return (
      <div className={styles.root}>
        <h1 className={styles.heading}>My Auctions</h1>
        <nav className={styles.tabBar}>
          {TABS.map(tab => (
              <button
                  key={tab.key}
                  className={`${styles.tabButton} ${tab.key === activeTab ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
          ))}
        </nav>
        <div className={styles.cardsGrid}>
          {loading ? (
              <p>Loading...</p>
          ) : cards.length === 0 ? (
              <p className={styles.emptyMessage}>No items in this category.</p>
          ) : (
              cards.map(bid => (
                  <div key={bid.id} className={styles.card}>
                    <div className={styles.imageWrapper}>
                      <img
                          src={bid.productImage || '/images/default.png'}
                          alt={bid.productName}
                          className={styles.cardImage}
                      />
                      {activeTab === 'inProgress' && (
                          <span className={styles.badgeLive}>Active</span>
                      )}
                    </div>
                    <h3 className={styles.cardTitle}>{bid.productName}</h3>
                    <div className={styles.bidInfo}>
                      Your Bid: <strong>${bid.amount?.toLocaleString()}</strong>
                    </div>
                    <div className={styles.bidInfo}>
                      Current Bid: <strong>${bid.amount?.toLocaleString()}</strong>
                    </div>
                  </div>
              ))
          )}
        </div>
      </div>
  );}
