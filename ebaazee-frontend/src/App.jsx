// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RequireRegistration from './components/RequireRegistration';
import RequireLogin        from './components/RequireLogin';

import RegisterPage        from './pages/RegisterPage';
import LoginPage           from './pages/LoginPage';
import SideMenu            from './components/SideMenu';
import SellerLayout from './components/SellerLayout';
import SellerPage from './pages/SellerPage';
import MyListingsPage from './pages/MyListingsPage';
import AdminPage    from './pages/AdminPage'
import { ProductsProvider } from './context/ProductsContext';

function App() {
  return (
    <ProductsProvider>
      <Router>
        <Routes>
          {/* 1. Registration is always open */}
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. All login and beyond requires registration */}
          {/*<Route element={<RequireRegistration />}>*/}
            <Route path="/login" element={<LoginPage />} />

            {/* 3. Buyer and Seller flows both require login */}
            <Route element={<RequireLogin />}>
              <Route path="/admin"   element={<AdminPage />} />
              <Route path="/explore" element={<SideMenu />} />
              <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerPage />} />
                <Route path="listings" element={<MyListingsPage />} />
              </Route>
            </Route>
          {/*</Route>*/}

          {/* Default “/” or unknown → redirect to the correct first step */}
          <Route
            path="/"
            element={
              localStorage.getItem('isRegistered') !== 'true'? 
              (<Navigate to="/register" replace />)
              : localStorage.getItem('isLoggedIn') !== 'true' ? 
              (<Navigate to="/login" replace/>)
              : localStorage.getItem('adminLoggedIn') === 'true' ?
              ( <Navigate to="/admin" replace />)
              : localStorage.getItem('userRole') === 'seller' ?
              (<Navigate to="/seller" replace />):
              (<Navigate to="/explore" replace />)
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ProductsProvider>
  );
}

export default App;
