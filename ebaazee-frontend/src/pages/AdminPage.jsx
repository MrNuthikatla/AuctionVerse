// src/pages/AdminPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import styles from '../css/AdminPage.module.css';

export default function AdminPage() {
  const { products, updateStatus } = useProducts();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    navigate('/login', { replace: true });
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/admin/products/report', {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          // Add Authorization header here if your API requires auth
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to download file');
      const blob = await response.blob();

      if ('showSaveFilePicker' in window) {
        const opts = {
          suggestedName: 'Product_Report.xlsx',
          types: [
            {
              description: 'Excel Workbook',
              accept: {
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
              }
            }
          ]
        };

        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Product_Report.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download the report.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin: Manage Auction Status</h1>
        <div className={styles.headerButtons}>
          <button className={styles.reportBtn} onClick={handleDownloadReport}>
            Download Product Report
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
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
