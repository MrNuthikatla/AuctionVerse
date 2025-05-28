// src/pages/SellerPage.jsx
import React, { useState, useEffect } from 'react';
import styles from '../css/SellerPage.module.css';

export default function SellerPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    endTime: '',
    minBid: '',
    maxBid: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token'); // assuming token is saved here after login
        const response = await fetch('http://localhost:9090/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        alert('Error loading categories. Please make sure you are logged in.');
      }
    };

    fetchCategories();
  }, []);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // use your method of storing the JWT

      const resp = await fetch('http://localhost:9090/api/seller/addproducts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // pass JWT token
        },
        body: JSON.stringify({
          ...form,
          minBid: parseFloat(form.minBid),
          maxBid: parseFloat(form.maxBid),
        }),
      });

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || 'Network error');
      }

      alert('Product created!');
      setForm({
        name: '',
        description: '',
        category: '',
        endTime: '',
        minBid: '',
        maxBid: '',
      });
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  return (
      <div>
        <h1>Create New Auction Listing</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Name</label>
            <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                required
            />
          </div>

          <div className={styles.field}>
            <label>Category</label>
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
            >
              <option value="">-- select --</option>
              {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>End Time</label>
            <input
                name="endTime"
                type="datetime-local"
                value={form.endTime}
                onChange={handleChange}
                required
            />
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <label>Minimum Bid</label>
              <input
                  name="minBid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minBid}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className={styles.field}>
              <label>Maximum Bid</label>
              <input
                  name="maxBid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.maxBid}
                  onChange={handleChange}
                  required
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Listing
          </button>
        </form>
      </div>
  );
}
