// src/pages/SettingsPage.jsx
import React, { useState,useEffect } from 'react';
import userData from '../data/UserProfile.json';
import styles from '../css/SettingsPage.module.css';
import defaultAvatars from '../data/defaultAvatars.json';

export default function SettingsPage() {
  const [avatar, setAvatar]       = useState(userData.avatarUrl);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName]   = useState(userData.lastName);
  const [address, setAddress]     = useState(userData.address);
  const [email, setEmail]         = useState(userData.email);
  const [phone, setPhone]         = useState(userData.phone);

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
        setLastName(data.lastName);
        setEmail(data.username);
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

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    alert('Profile saved (stub)');
  };

  return (
    <div className={styles.root}>
      {/* Profile picture section */}
      <section className={styles.card}>
        <h2 className={styles.heading}>Edit Your Profile Picture</h2>
        <hr className={styles.divider} />

        <div className={styles.avatarSection}>
          <img src={avatar} alt="Avatar" className={styles.avatar} />
          <div className={styles.uploadGroup}>
            <label htmlFor="avatarUpload" className={styles.uploadLabel}>
              Choose file
            </label>
            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              onChange={handleAvatarChange}
              className={styles.uploadInput}
            />
            <small className={styles.uploadHelp}>JPEG 100×100</small>
          </div>
        </div>
      </section>


      <section className={styles.card}>
        <h2 className={styles.heading}>Edit Your Information</h2>
        <hr className={styles.divider} />

        <div className={styles.formGrid}>
          {/* First & Last */}
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>

          {/* Address full width */}
          <div className={`${styles.fullWidth} ${styles.formGroup}`}>
            <label>Your Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Email full width */}
          <div className={`${styles.fullWidth} ${styles.formGroup}`}>
            <label>Email Address</label>
            <div className={styles.inlineGroup}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className={styles.verifyButton}>
                Verify Email
              </button>
            </div>
          </div>

          {/* Phone full width */}
          <div className={`${styles.fullWidth} ${styles.formGroup}`}>
            <label>Phone Number</label>
            <div className={styles.inlineGroup}>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button className={styles.verifyButton}>
                Verify Phone
              </button>
            </div>
          </div>
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
          Save Changes
        </button>
      </section>
    </div>
  );
}
