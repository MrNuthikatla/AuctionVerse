// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import glassBg from '../assets/abstract-bg.png';
import logo from '../assets/logo.png'; 
import '../css/LoginPage.css';         

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // localStorage.setItem('isLoggedIn', 'true');
    // const role = localStorage.getItem('role');
    // if(role == "buyer")
    //   navigate('/explore');
    // else
    //   navigate('/seller')
    if (email === 'admin@example.com' && password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('adminLoggedIn', 'true');
      return navigate('/admin', { replace: true });
    }

    const regEmail = localStorage.getItem('registeredEmail');
    const regPass  = localStorage.getItem('registeredPassword');
    const role     = localStorage.getItem('userRole');

    if (email === regEmail && password === regPass) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.removeItem('adminLoggedIn');
      // route by role
      if (role === 'seller') {
        navigate('/seller',{ replace: true });
      } else {
        navigate('/explore',{ replace: true });
      }
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <img src={glassBg} alt="Glassmorphic overlay" className="glass-bg" />
      <div className="login-card">
        
      <img src={logo} alt="eBaazee Logo" className="login-logo" />

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
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
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Remember me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="btn">
            Sign in
          </button>
        </form>

        <div className="social-login">
          {/* <button>
            <img src="/assets/google.svg" alt="Google" />
            Google
          </button>
          <button>
            <img src="/assets/github.svg" alt="GitHub" />
            GitHub
          </button>
          <button>
            <img src="/assets/facebook.svg" alt="Facebook" />
            Facebook
          </button> */}
        </div>

        <div className="footer">
          Don’t have an account?{' '}
          <Link to="/register">Register for free</Link>
        </div>
      </div>
    </div>
  );
}
