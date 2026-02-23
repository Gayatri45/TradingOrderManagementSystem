// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../hooks/useAppContext';
// import { userAPI } from '../services/api';
// import '../styles/Auth.css';

// export const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const { setUser, setLoading } = useAppContext();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await userAPI.getUserByEmail(formData.email);
//       if (response.data.password === formData.password) {
//         setUser(response.data);
//         navigate('/dashboard');
//       } else {
//         setError('Invalid credentials');
//       }
//     } catch (err) {
//       setError('User not found');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         {error && <div className="error-message">{error}</div>}

//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit" className="btn-submit">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../hooks/useAppContext';
// import { authAPI } from '../services/api';
// import '../styles/Auth.css';

// export const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { setUser, setLoading: setAppLoading } = useAppContext();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setAppLoading(true);

//     try {
//       const response = await authAPI.login(formData);
      
//       if (response.data) {
//         setUser({
//           id: response.data.userId,
//           email: response.data.email,
//           fullName: response.data.fullName,
//           walletBalance: response.data.walletBalance,
//         });
//         navigate('/dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid email or password');
//     } finally {
//       setLoading(false);
//       setAppLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Login</h2>
//         {error && <div className="error-message">{error}</div>}

//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             disabled={loading}
//           />
//         </div>

//         <button type="submit" className="btn-submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { authAPI } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { height: 100%; }

  .login-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #04060f;
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: #e8eaf0;
    overflow: hidden;
  }

  /* ── RIGHT BRANDING PANEL ── */
  .login-right {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 56px;
    background: #070b18;
    border-left: 1px solid rgba(255,255,255,.05);
    overflow: hidden;
    order: 2;
  }
  .login-right::before {
    content: '';
    position: absolute;
    bottom: -120px; right: -120px;
    width: 520px; height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,160,.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .login-right::after {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 380px; height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,90,255,.06) 0%, transparent 70%);
    pointer-events: none;
  }
  .right-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
    mask-image: linear-gradient(180deg, transparent 0%, black 40%, transparent 100%);
  }

  .right-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -.02em;
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 1;
    align-self: flex-end;
  }
  .right-logo em { font-style: normal; color: #00e5a0; }

  .right-content {
    position: relative;
    z-index: 1;
  }
  .right-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,229,160,.08);
    border: 1px solid rgba(0,229,160,.2);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 11px;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: #00e5a0;
    margin-bottom: 28px;
  }
  .right-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #00e5a0;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .3; transform: scale(.7); }
  }

  .right-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 3.2vw, 50px);
    font-weight: 800;
    letter-spacing: -.04em;
    line-height: 1.0;
    color: #fff;
    margin-bottom: 20px;
  }
  .right-heading .accent { color: #00e5a0; }

  .right-desc {
    font-size: 15px;
    font-weight: 300;
    color: #4a5168;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 48px;
  }

  /* Live market mini-cards */
  .market-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .market-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 12px;
    padding: 14px 18px;
    transition: border-color .2s;
  }
  .market-card:hover { border-color: rgba(0,229,160,.15); }
  .market-card-left { display: flex; align-items: center; gap: 12px; }
  .market-icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    background: rgba(0,229,160,.08);
    border: 1px solid rgba(0,229,160,.14);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
  }
  .market-name {
    font-family: 'Syne', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -.01em;
  }
  .market-full { font-size: 11px; color: #3a4155; margin-top: 1px; }
  .market-price {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -.01em;
    text-align: right;
  }
  .market-change { font-size: 11.5px; margin-top: 2px; text-align: right; }
  .market-change.up { color: #00e5a0; }
  .market-change.down { color: #ff4d6d; }

  .right-footer {
    font-size: 12px;
    color: #2d3347;
    position: relative;
    z-index: 1;
    align-self: flex-end;
  }

  /* ── LEFT FORM PANEL ── */
  .login-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 64px;
    background: #04060f;
    overflow-y: auto;
    order: 1;
  }

  .form-card {
    width: 100%;
    max-width: 400px;
    animation: fadeUp .55s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .form-top-logo {
    display: none;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -.02em;
    color: #fff;
    text-decoration: none;
    margin-bottom: 36px;
  }
  .form-top-logo em { font-style: normal; color: #00e5a0; }

  .form-header { margin-bottom: 36px; }
  .form-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -.03em;
    color: #fff;
    margin-bottom: 6px;
  }
  .form-header p {
    font-size: 14px;
    font-weight: 300;
    color: #4a5168;
  }
  .form-header p a {
    color: #00e5a0;
    text-decoration: none;
    font-weight: 500;
  }
  .form-header p a:hover { text-decoration: underline; }

  /* Error */
  .error-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,77,109,.08);
    border: 1px solid rgba(255,77,109,.2);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13.5px;
    color: #ff7090;
    margin-bottom: 24px;
    animation: fadeUp .3s ease both;
  }
  .error-box::before { content: '⚠'; font-size: 14px; flex-shrink: 0; }

  /* Field */
  .field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 18px;
  }
  .field label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #4a5168;
  }
  .field-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .field-row label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #4a5168;
  }
  .field-row a {
    font-size: 12px;
    color: #00e5a0;
    text-decoration: none;
    font-weight: 500;
    letter-spacing: .02em;
  }
  .field-row a:hover { text-decoration: underline; }

  .field input {
    width: 100%;
    padding: 13px 16px;
    border-radius: 10px;
    background: #0b0f1e;
    border: 1px solid rgba(255,255,255,.07);
    color: #e8eaf0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 400;
    outline: none;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .field input::placeholder { color: #2d3347; }
  .field input:focus {
    border-color: rgba(0,229,160,.4);
    box-shadow: 0 0 0 3px rgba(0,229,160,.07);
    background: #0d1120;
  }
  .field input:disabled { opacity: .4; cursor: not-allowed; }
  .field input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #0b0f1e inset;
    -webkit-text-fill-color: #e8eaf0;
  }

  /* Divider */
  .form-divider {
    height: 1px;
    background: rgba(255,255,255,.05);
    margin: 22px 0;
  }

  /* Submit */
  .btn-submit {
    width: 100%;
    padding: 15px;
    border-radius: 10px;
    background: #00e5a0;
    color: #04060f;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    letter-spacing: .02em;
    transition: opacity .2s, transform .2s, box-shadow .2s;
    box-shadow: 0 0 40px rgba(0,229,160,.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .btn-submit:hover:not(:disabled) {
    opacity: .88;
    transform: translateY(-1px);
    box-shadow: 0 0 60px rgba(0,229,160,.4);
  }
  .btn-submit:disabled { opacity: .4; cursor: not-allowed; transform: none; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(4,6,15,.3);
    border-top-color: #04060f;
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .register-link {
    text-align: center;
    margin-top: 22px;
    font-size: 13px;
    color: #3a4155;
  }
  .register-link a {
    color: #00e5a0;
    text-decoration: none;
    font-weight: 500;
  }
  .register-link a:hover { text-decoration: underline; }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .login-page { grid-template-columns: 1fr; }
    .login-right { display: none; }
    .login-left { padding: 40px 28px; min-height: 100vh; order: 1; }
    .form-top-logo { display: block; }
  }
`;

const markets = [
  { icon: '₿', symbol: 'BTC/USD', name: 'Bitcoin',  price: '67,420.50', change: '+2.4%', up: true  },
  { icon: 'Ξ', symbol: 'ETH/USD', name: 'Ethereum', price: '3,518.22',  change: '+1.8%', up: true  },
  { icon: 'S', symbol: 'SPX500',  name: 'S&P 500',  price: '5,234.11',  change: '-0.3%', up: false },
];

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setLoading: setAppLoading } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAppLoading(true);
    try {
      const response = await authAPI.login(formData);
      console.log(response.data)
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        setUser({
          id: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
          walletBalance: response.data.walletBalance,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
      setAppLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">

        {/* ── LEFT: FORM ── */}
        <div className="login-left">
          <div className="form-card">
            <Link to="/" className="form-top-logo">24<em>Markets</em></Link>

            <div className="form-header">
              <h2>Welcome back</h2>
              <p>No account yet? <Link to="/register">Create one free →</Link></p>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <div className="field-row">
                  <label>Password</label>
                  <a href="/forgot-password">Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-divider" />

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Signing in…</>
                  : <>Sign In →</>
                }
              </button>
            </form>

            <div className="register-link">
              Don't have an account? <Link to="/register">Sign up free</Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT: BRANDING ── */}
        <div className="login-right">
          <div className="right-grid" />
          <Link to="/" className="right-logo">24<em>Markets</em></Link>

          <div className="right-content">
            <div className="right-badge">Markets open now</div>
            <h1 className="right-heading">
              Your edge in<br />
              <span className="accent">every market.</span>
            </h1>
            <p className="right-desc">
              Real-time prices, institutional execution, and advanced tools — all waiting for you.
            </p>

            <div className="market-cards">
              {markets.map((m, i) => (
                <div className="market-card" key={i}>
                  <div className="market-card-left">
                    <div className="market-icon">{m.icon}</div>
                    <div>
                      <div className="market-name">{m.symbol}</div>
                      <div className="market-full">{m.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="market-price">{m.price}</div>
                    <div className={`market-change ${m.up ? 'up' : 'down'}`}>
                      {m.up ? '▲' : '▼'} {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-footer">© 2026 24Markets. All rights reserved.</div>
        </div>

      </div>
    </>
  );
};