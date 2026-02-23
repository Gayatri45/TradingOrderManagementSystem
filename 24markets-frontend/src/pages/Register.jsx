import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { authAPI } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { height: 100%; }

  .register-page {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #04060f;
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: #e8eaf0;
    overflow: hidden;
  }

  /* ── LEFT PANEL ── */
  .register-left {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 56px;
    background: #070b18;
    border-right: 1px solid rgba(255,255,255,.05);
    overflow: hidden;
  }
  .register-left::before {
    content: '';
    position: absolute;
    top: -120px; left: -120px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,160,.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .register-left::after {
    content: '';
    position: absolute;
    bottom: -80px; right: -80px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,90,255,.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Grid overlay */
  .left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
    background-size: 56px 56px;
    pointer-events: none;
    mask-image: linear-gradient(180deg, black 0%, transparent 100%);
  }

  .left-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -.02em;
    color: #fff;
    text-decoration: none;
    position: relative;
    z-index: 1;
  }
  .left-logo em { font-style: normal; color: #00e5a0; }

  .left-content {
    position: relative;
    z-index: 1;
  }
  .left-badge {
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
  .left-badge::before {
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

  .left-heading {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 3.5vw, 52px);
    font-weight: 800;
    letter-spacing: -.04em;
    line-height: 1.0;
    color: #fff;
    margin-bottom: 20px;
  }
  .left-heading .accent { color: #00e5a0; }

  .left-desc {
    font-size: 15px;
    font-weight: 300;
    color: #4a5168;
    line-height: 1.7;
    max-width: 340px;
    margin-bottom: 48px;
  }

  .left-perks {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .perk {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 14px;
    font-weight: 400;
    color: #7f8799;
  }
  .perk-dot {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(0,229,160,.08);
    border: 1px solid rgba(0,229,160,.18);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  .left-footer {
    font-size: 12px;
    color: #2d3347;
    position: relative;
    z-index: 1;
  }

  /* ── RIGHT PANEL (FORM) ── */
  .register-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 64px;
    background: #04060f;
    overflow-y: auto;
  }

  .form-card {
    width: 100%;
    max-width: 420px;
    animation: fadeUp .55s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .form-header {
    margin-bottom: 36px;
  }
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

  /* Name row */
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-bottom: 16px;
  }

  /* Field */
  .field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 16px;
  }
  .field:last-of-type { margin-bottom: 0; }

  .field label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #4a5168;
  }

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
    -webkit-autofill: none;
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

  /* Password strength */
  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }
  .strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,.06);
    transition: background .3s;
  }
  .strength-seg.weak   { background: #ff4d6d; }
  .strength-seg.medium { background: #f59e0b; }
  .strength-seg.strong { background: #00e5a0; }
  .strength-label {
    font-size: 11px;
    color: #3a4155;
    margin-top: 5px;
    min-height: 14px;
  }

  /* Divider */
  .form-divider {
    height: 1px;
    background: rgba(255,255,255,.05);
    margin: 24px 0;
  }

  /* Terms */
  .terms {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 24px;
    font-size: 13px;
    color: #3a4155;
    line-height: 1.55;
  }
  .terms input[type="checkbox"] {
    width: 16px; height: 16px;
    flex-shrink: 0;
    accent-color: #00e5a0;
    margin-top: 1px;
    cursor: pointer;
  }
  .terms a { color: #00e5a0; text-decoration: none; }
  .terms a:hover { text-decoration: underline; }

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

  /* Spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(4,6,15,.3);
    border-top-color: #04060f;
    border-radius: 50%;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Sign-in link */
  .signin-link {
    text-align: center;
    margin-top: 22px;
    font-size: 13px;
    color: #3a4155;
  }
  .signin-link a {
    color: #00e5a0;
    text-decoration: none;
    font-weight: 500;
  }
  .signin-link a:hover { text-decoration: underline; }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .register-page { grid-template-columns: 1fr; }
    .register-left { display: none; }
    .register-right { padding: 40px 28px; min-height: 100vh; }
  }
`;

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', segs: [null, null, null] };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[^a-zA-Z0-9]/.test(pw) || /[A-Z]/.test(pw)) score++;
  const labels = ['', 'Weak', 'Medium', 'Strong'];
  const classes = [null, 'weak', 'medium', 'strong'];
  const segs = [
    score >= 1 ? classes[Math.min(score, 3)] : null,
    score >= 2 ? classes[Math.min(score, 3)] : null,
    score >= 3 ? classes[Math.min(score, 3)] : null,
  ];
  return { score, label: labels[Math.min(score, 3)], segs };
};

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setLoading: setAppLoading } = useAppContext();
  const navigate = useNavigate();

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) { setError('Please accept the Terms of Service to continue'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    setAppLoading(true);
    console.log(formData)

    try {
      const response = await authAPI.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data) {
        setUser({
          id: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
          walletBalance: response.data.walletBalance,
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
      setAppLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="register-page">

        {/* ── LEFT PANEL ── */}
        <div className="register-left">
          <div className="left-grid" />
          <Link to="/" className="left-logo">24<em>Markets</em></Link>

          <div className="left-content">
            <div className="left-badge">Join 140k+ traders</div>
            <h1 className="left-heading">
              Start trading<br />
              <span className="accent">in minutes.</span>
            </h1>
            <p className="left-desc">
              Open a free account and access real-time markets, advanced charting, and institutional-grade execution — no experience needed.
            </p>
            <div className="left-perks">
              {[
                { icon: '⚡', text: 'Sub-millisecond order execution' },
                { icon: '🔒', text: 'Bank-grade security & encryption' },
                { icon: '📊', text: 'Real-time data across 180+ markets' },
                { icon: '💳', text: 'No hidden fees. Ever.' },
              ].map((p, i) => (
                <div className="perk" key={i}>
                  <div className="perk-dot">{p.icon}</div>
                  {p.text}
                </div>
              ))}
            </div>
          </div>

          <div className="left-footer">© 2026 24Markets. All rights reserved.</div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="register-right">
          <div className="form-card">
            <div className="form-header">
              <h2>Create your account</h2>
              <p>Already have one? <Link to="/login">Sign in →</Link></p>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="form-row">
                <div className="field">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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
                />
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <div className="strength-bar">
                  {strength.segs.map((cls, i) => (
                    <div key={i} className={`strength-seg${cls ? ' ' + cls : ''}`} />
                  ))}
                </div>
                {formData.password && (
                  <div className="strength-label">{strength.label} password</div>
                )}
              </div>

              <div className="field">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-divider" />

              <div className="terms">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="agree">
                  I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>. I understand that trading involves risk.
                </label>
              </div>

              <button type="submit" className="btn-submit" disabled={loading || !agreed}>
                {loading ? (
                  <><div className="spinner" /> Creating account…</>
                ) : (
                  <>Create Account →</>
                )}
              </button>
            </form>

            <div className="signin-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
