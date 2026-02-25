import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import '../styles/Navbar.css';

export const Navbar = () => {
  const { user, logoutUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isAdmin = user?.role === "ROLE_ADMIN";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          24Markets
        </Link>

        <ul className="nav-menu">         

          {user ? (
            <>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/markets" className="nav-link">
                  Markets
                </Link>
              </li>

              {/* ===== USER NAV ===== */}
              {!isAdmin && (
                <li className="nav-item">
                  <Link to="/orders" className="nav-link">
                    Orders
                  </Link>
                </li>
              )}

              {/* ===== ADMIN NAV ===== */}
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <Link to="/users" className="nav-link">
                      Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/usersOrders" className="nav-link">
                      Users Orders
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item nav-user">
                <span className="user-name">{user.fullName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};