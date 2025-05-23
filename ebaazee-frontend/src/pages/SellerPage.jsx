// src/pages/SellerPage.jsx
import React, { useState, useEffect } from 'react';
import categoriesData from '../data/categories.json';
import styles from '../css/SellerPage.module.css';

export default function SellerPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    startTime: '',
    endTime: '',
    minBid: '',
    maxBid: '',
  });

  useEffect(() => {
    setCategories(categoriesData.categories);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const resp = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!resp.ok) throw new Error('Network error');
      alert('Product created!');
      setForm({
        title: '',
        description: '',
        categoryId: '',
        startTime: '',
        endTime: '',
        minBid: '',
        maxBid: '',
      });
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    }
  };

  return (
    <div>
      <h1>Create New Auction Listing</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Title</label>
          <input
            name="title"
            type="text"
            value={form.title}
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
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- select --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.field}>
            <label>Start Time</label>
            <input
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={handleChange}
              required
            />
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
