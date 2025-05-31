import React, {useState,useEffect} from 'react';
import data from '../data/DashboardData.json';
import styles from '../css/DashboardPage.module.css';
import userData from '../data/UserProfile.json';
import defaultAvatars from '../data/defaultAvatars.json';

export default function DashboardPage() {
  const {stats, bids, pagination } = data;
  const [firstName, setFirstName] = useState('');
  const [avatar, setAvatar] = useState(userData.avatarUrl);


    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('http://localhost:9090/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setFirstName(data.firstName);
      })
      .catch(() => console.log("error"));
    }, []);
  
  useEffect(() => {
    const isPlaceholder = avatar === userData.avatarUrl;
    if (isPlaceholder) {
      const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
      setAvatar(defaultAvatars[randomIndex]);
    }
  },[]);

  return (
    <div className={styles.root}>
      {/* Greeting */}
      <header className={styles.header}>
        <img src={avatar} alt="Avatar" className={styles.avatar} />
        <div>
          <h1 className={styles.greeting}>Hi, {firstName}</h1>
          <p className={styles.subtitle}>
          You had participated in {userData.auctionCountEachMonth} auctions last month. Start your auction today.
          </p>
        </div>
      </header>

      {/* Stats cards */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div
            key={s.key}
            className={styles.statCard}
            style={{ backgroundColor: s.color }}
          >
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Bidding summary table */}
      <section className={styles.tableSection}>
        <h2 className={styles.tableTitle}>Bidding Summary</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Auction ID</th>
                <th>Product Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Auction Date</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.product}</td>
                  <td>${row.amount.toLocaleString()}</td>
                  <td>
                    <span
                      className={
                        row.status === 'Winning'
                          ? styles.statusWin
                          : styles.statusCancel
                      }
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          {Array.from({ length: pagination.total }, (_, i) => (
            <button
              key={i + 1}
              className={
                i + 1 === pagination.current
                  ? styles.pageActive
                  : styles.pageButton
              }
            >
              {i + 1}
            </button>
          ))}
          <button className={styles.pageButton}>&rarr;</button>
        </div>
      </section>
    </div>
  );
}
