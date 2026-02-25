import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Inline styles to replace '../styles/Home.css'
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .home {
    font-family: 'DM Sans', sans-serif;
    background: #04060f;
    color: #e8eaf0;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── TICKER ── */
  .ticker-bar {
    background: #0b0f1e;
    border-bottom: 1px solid rgba(255,255,255,.06);
    padding: 10px 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .ticker-inner {
    display: inline-flex;
    gap: 48px;
    animation: ticker 28s linear infinite;
  }
  .ticker-item {
    font-size: 12px;
    letter-spacing: .06em;
    color: #7f8799;
  }
  .ticker-item span { color: #00e5a0; margin-left: 6px; }
  .ticker-item span.down { color: #ff4d6d; }
  @keyframes ticker {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── NAV ── */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 64px;
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(4,6,15,.8);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,.05);
  }
  .nav-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -.02em;
    color: #fff;
    text-decoration: none;
  }
  .nav-logo em {
    font-style: normal;
    color: #00e5a0;
  }
  .nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
  }
  .nav-links a {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: #7f8799;
    text-decoration: none;
    transition: color .2s;
  }
  .nav-links a:hover { color: #fff; }
  .nav-cta {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 22px;
    border-radius: 8px;
    background: #00e5a0;
    color: #04060f;
    text-decoration: none;
    letter-spacing: .02em;
    transition: opacity .2s, transform .15s;
  }
  .nav-cta:hover { opacity: .88; transform: translateY(-1px); }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 32px;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,229,160,.08) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0,100,255,.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 64px 64px;
    mask-image: radial-gradient(ellipse 90% 80% at 50% 0%, black 30%, transparent 100%);
    pointer-events: none;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,229,160,.08);
    border: 1px solid rgba(0,229,160,.2);
    border-radius: 100px;
    padding: 6px 16px;
    font-size: 12px;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #00e5a0;
    margin-bottom: 32px;
    animation: fadeUp .6s ease both;
  }
  .hero-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #00e5a0;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: .4; transform: scale(.8); }
  }

  .hero h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(42px, 7vw, 88px);
    line-height: 1.0;
    letter-spacing: -.04em;
    color: #fff;
    max-width: 820px;
    animation: fadeUp .7s .1s ease both;
  }
  .hero h1 .accent { color: #00e5a0; }

  .hero-sub {
    font-size: clamp(16px, 2vw, 19px);
    font-weight: 300;
    color: #7f8799;
    max-width: 500px;
    margin-top: 20px;
    line-height: 1.6;
    animation: fadeUp .7s .2s ease both;
  }

  .hero-buttons {
    display: flex;
    gap: 14px;
    margin-top: 42px;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp .7s .3s ease both;
  }
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 15px 32px;
    border-radius: 10px;
    background: #00e5a0;
    color: #04060f;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    letter-spacing: .01em;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 0 40px rgba(0,229,160,.25);
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(0,229,160,.4); }
  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 15px 32px;
    border-radius: 10px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.1);
    color: #e8eaf0;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    transition: background .2s, border-color .2s, transform .2s;
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,.09);
    border-color: rgba(255,255,255,.2);
    transform: translateY(-2px);
  }

  /* ── STATS ── */
  .stats {
    display: flex;
    justify-content: center;
    gap: 0;
    border-top: 1px solid rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.06);
    background: #070b18;
    animation: fadeUp .7s .45s ease both;
  }
  .stat {
    flex: 1;
    max-width: 220px;
    padding: 32px 24px;
    text-align: center;
    border-right: 1px solid rgba(255,255,255,.06);
  }
  .stat:last-child { border-right: none; }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -.03em;
  }
  .stat-value em { font-style: normal; color: #00e5a0; }
  .stat-label {
    font-size: 12px;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: #4a5168;
    margin-top: 6px;
  }

  /* ── FEATURES ── */
  .features {
    padding: 120px 64px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .features-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 64px;
  }
  .features h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 700;
    letter-spacing: -.03em;
    color: #fff;
    line-height: 1.1;
    max-width: 380px;
  }
  .features-sub {
    font-size: 14px;
    color: #4a5168;
    max-width: 260px;
    line-height: 1.7;
    text-align: right;
  }

  .feature-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .card {
    background: #0b0f1e;
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 16px;
    padding: 36px 32px;
    position: relative;
    overflow: hidden;
    transition: border-color .3s, transform .3s;
    cursor: default;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,229,160,.4), transparent);
    opacity: 0;
    transition: opacity .3s;
  }
  .card:hover { border-color: rgba(0,229,160,.2); transform: translateY(-4px); }
  .card:hover::before { opacity: 1; }

  .card-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: rgba(0,229,160,.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    font-size: 20px;
  }
  .card h3 {
    font-family: 'Syne', sans-serif;
    font-size: 19px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -.02em;
    margin-bottom: 12px;
  }
  .card p {
    font-size: 14px;
    font-weight: 300;
    color: #5c6479;
    line-height: 1.7;
  }

  /* ── CTA SECTION ── */
  .cta-section {
    margin: 0 64px 120px;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(0,229,160,.07) 0%, rgba(0,100,255,.05) 100%);
    border: 1px solid rgba(0,229,160,.15);
    padding: 80px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    position: relative;
    overflow: hidden;
  }
  .cta-section::after {
    content: '';
    position: absolute;
    right: -60px; top: -60px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,160,.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-text h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 700;
    letter-spacing: -.03em;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 14px;
  }
  .cta-text p {
    font-size: 15px;
    color: #5c6479;
    font-weight: 300;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .nav { padding: 18px 24px; }
    .nav-links { display: none; }
    .features { padding: 80px 24px; }
    .features-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .features-sub { text-align: left; }
    .feature-cards { grid-template-columns: 1fr; }
    .stats { flex-wrap: wrap; }
    .stat { max-width: none; flex: 1 1 calc(50% - 1px); }
    .cta-section { margin: 0 24px 80px; flex-direction: column; padding: 48px 32px; }
  }
`;

const tickerData = [
  { symbol: 'BTC/USD', price: '67,420.50', change: '+2.4%', up: true },
  { symbol: 'ETH/USD', price: '3,518.22', change: '+1.8%', up: true },
  { symbol: 'SPX',     price: '5,234.11', change: '-0.3%', up: false },
  { symbol: 'AAPL',    price: '189.40',   change: '+0.9%', up: true },
  { symbol: 'TSLA',    price: '242.75',   change: '-1.2%', up: false },
  { symbol: 'GLD',     price: '2,311.80', change: '+0.5%', up: true },
  { symbol: 'EUR/USD', price: '1.0842',   change: '+0.1%', up: true },
  { symbol: 'NQ100',   price: '18,440',   change: '+0.6%', up: true },
];

export const Home = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="home">

        {/* Live Ticker */}
        <div className="ticker-bar">
          <div className="ticker-inner">
            {[...tickerData, ...tickerData].map((item, i) => (
              <div className="ticker-item" key={i}>
                {item.symbol} &nbsp; {item.price}
                <span className={item.up ? '' : 'down'}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="nav">
          <a href="/" className="nav-logo">24<em>Markets</em></a>
          <ul className="nav-links">
            <li><a href="/markets">Markets</a></li>
            <li><a href="/trade">Trade</a></li>
            <li><a href="/portfolio">Portfolio</a></li>
            <li><a href="/about">About</a></li>
          </ul>
          <Link to="/register" className="nav-cta">Get Started →</Link>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-grid" />

          <div className="hero-badge">Live Markets Open Now</div>

          <h1>
            Trade the Markets,<br />
            <span className="accent">Around the Clock.</span>
          </h1>

          <p className="hero-sub">
            Real-time data, institutional-grade execution, and advanced analytics — all in one platform built for serious traders.
          </p>

          <div className="hero-buttons">
            <Link to="/markets" className="btn-primary">
              Start Trading →
            </Link>
            <Link to="/register" className="btn-secondary">
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Stats */}
        <div className="stats">
          {[
            { value: '$2.4', suffix: 'B', label: 'Daily Volume' },
            { value: '180', suffix: '+', label: 'Markets Available' },
            { value: '0.8', suffix: 'ms', label: 'Avg Execution' },
            { value: '99.9', suffix: '%', label: 'Uptime SLA' },
          ].map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-value">{s.value}<em>{s.suffix}</em></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <section className="features">
          <div className="features-header">
            <h2>Built for speed.<br />Designed for precision.</h2>
            <p className="features-sub">Everything you need to trade with confidence, all in one place.</p>
          </div>

          <div className="feature-cards">
            {[
              {
                icon: '⚡',
                title: 'Real-time Data',
                desc: 'Sub-millisecond market data feeds powered by Redis caching. Never miss a price movement that matters.',
              },
              {
                icon: '🔒',
                title: 'Bank-grade Security',
                desc: 'End-to-end encryption and multi-factor authentication backed by a hardened Spring Boot infrastructure.',
              },
              {
                icon: '📈',
                title: 'Fast Execution',
                desc: 'Optimised MySQL query pipelines and smart order routing ensure your trades execute at the best available price.',
              },
            ].map((card, i) => (
              <div className="card" key={i}>
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <div className="cta-text">
            <h2>Ready to start<br />trading smarter?</h2>
            <p>Join thousands of traders on 24Markets. Free account, no commitment.</p>
          </div>
          <Link to="/register" className="btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
            Open Free Account →
          </Link>
        </section>

      </div>
    </>
  );
};