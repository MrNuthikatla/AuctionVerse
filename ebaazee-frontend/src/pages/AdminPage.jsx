// src/pages/AdminPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import styles from '../css/AdminPage.module.css';

export default function AdminPage() {
  const { products, updateStatus } = useProducts();
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    navigate('/login', { replace: true });
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin: Manage Auction Status</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </header>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Current Status</th>
            <th>Change To…</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.status}</td>
              <td>
                <select
                  value={p.status}
                  onChange={e => updateStatus(p.id, e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="frozen">Frozen</option>
                  <option value="sold">Sold</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
