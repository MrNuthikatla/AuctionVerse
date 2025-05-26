import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/RegisterPage.css';
import glassBg from '../assets/abstract-bg.png'; 

export default function RegisterPage() {
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole]             = useState(''); // default to buyer
  const navigate = useNavigate();

  const handleRegister = e => {
    e.preventDefault();
    // Store registered user
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);
    localStorage.setItem('userRole', role);
    navigate('/login');
  };

  return (
    <div className="register-container">
      <img src={glassBg} alt="glass frame" className="glass-bg" />

      <div className="register-card">
        <h2>Create Account</h2>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter Valid Email Id"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter Valid Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* New Buyer/Seller radio group */}
          <div className="form-group role-group">
            <label>Register as</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === 'buyer'}
                  onChange={() => setRole('buyer')}
                />
                Buyer
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === 'seller'}
                  onChange={() => setRole('seller')}
                />
                Seller
              </label>
            </div>
          </div>

          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <div className="footer">
          Already have an account?{' '}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}