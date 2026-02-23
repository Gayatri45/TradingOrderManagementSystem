import React, { useEffect, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { marketAPI, orderAPI} from '../services/api';

/* ─── Icons ─────────────────────────────────────────────────────────── */
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
    </svg>
  ),
  EmptyState: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="22" x2="22" y2="22"/>
    </svg>
  ),
  Alert: () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
};

/* ─── Styles ─────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #f4f5f7;
    --surface:  #ffffff;
    --sf-hover: #f9fafb;
    --border:   #e5e7eb;
    --border-xs:rgba(0,0,0,0.05);
    --accent:   #6366f1;
    --ac-light: rgba(99,102,241,0.1);
    --green:    #10b981;
    --green-l:  rgba(16,185,129,0.1);
    --red:      #ef4444;
    --red-l:    rgba(239,68,68,0.1);
    --amber:    #f59e0b;
    --t1: #111827;
    --t2: #6b7280;
    --t3: #9ca3af;
    --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --sh-md: 0 4px 16px rgba(0,0,0,0.08);
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px;
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .ml-wrap {
    font-family: var(--font);
    color: var(--t1);
    background: var(--bg);
    min-height: 100vh;
    padding: 28px;
  }

  /* ── Page header ── */
  .ml-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
    animation: mlFadeIn 0.4s ease both;
  }
  .ml-header-left {}
  .ml-title {
    font-size: 22px; font-weight: 800; letter-spacing: -0.03em;
    color: var(--t1); margin-bottom: 3px;
  }
  .ml-subtitle { font-size: 13px; color: var(--t2); }

  .ml-header-right { display: flex; align-items: center; gap: 10px; }

  .ml-live-badge {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 7px 13px;
    font-size: 12px; font-weight: 600; color: var(--t2);
    box-shadow: var(--sh-sm);
  }
  .ml-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 6px var(--green);
    animation: mlPulse 2s infinite; flex-shrink: 0;
  }

  .ml-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    border: 1px solid var(--border); background: var(--surface);
    border-radius: var(--r-sm); padding: 7px 13px;
    font-size: 12px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer;
    transition: all 0.15s; box-shadow: var(--sh-sm);
  }
  .ml-refresh-btn:hover { background: var(--bg); color: var(--t1); border-color: #d1d5db; }
  .ml-refresh-btn.spinning svg { animation: mlSpin 0.8s linear infinite; }

  /* ── Search + filter bar ── */
  .ml-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
    animation: mlFadeIn 0.4s 0.05s ease both;
  }
  .ml-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 8px 14px;
    flex: 1; max-width: 280px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: var(--sh-sm);
  }
  .ml-search:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--ac-light);
  }
  .ml-search-icon { color: var(--t3); flex-shrink: 0; }
  .ml-search input {
    border: none; background: none; outline: none;
    font-size: 13px; color: var(--t1); font-family: var(--font); width: 100%;
  }
  .ml-search input::placeholder { color: var(--t3); }

  .ml-count {
    margin-left: auto;
    font-size: 12.5px; color: var(--t3); font-weight: 500;
  }
  .ml-count strong { color: var(--t1); font-weight: 700; }

  /* ── Card ── */
  .ml-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); box-shadow: var(--sh-sm);
    overflow: hidden;
    animation: mlFadeIn 0.4s 0.1s ease both;
  }

  /* ── Table ── */
  .ml-table-scroll { overflow-x: auto; }
  .ml-table { width: 100%; border-collapse: collapse; }

  .ml-table thead tr { background: #fafafa; }
  .ml-table th {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--t3);
    padding: 12px 18px; text-align: left;
    border-bottom: 1px solid var(--border);
    white-space: nowrap; user-select: none; cursor: pointer;
  }
  .ml-table th:first-child { padding-left: 24px; }
  .ml-table th:last-child  { padding-right: 24px; text-align: center; }
  .ml-table th:hover { color: var(--t1); }

  .ml-table td {
    padding: 14px 18px; font-size: 13.5px; color: var(--t1);
    border-bottom: 1px solid var(--border-xs); vertical-align: middle;
  }
  .ml-table td:first-child { padding-left: 24px; }
  .ml-table td:last-child  { padding-right: 24px; text-align: center; }
  .ml-table tbody tr:last-child td { border-bottom: none; }
  .ml-table tbody tr { transition: background 0.12s; }
  .ml-table tbody tr:hover { background: var(--sf-hover); }

  /* Symbol cell */
  .ml-symbol-cell { display: flex; align-items: center; gap: 10px; }
  .ml-symbol-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: var(--ac-light); display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: var(--accent);
    letter-spacing: -0.02em; font-family: var(--mono);
  }
  .ml-symbol-name { font-size: 13.5px; font-weight: 700; color: var(--t1); letter-spacing: -0.01em; }
  .ml-symbol-sub  { font-size: 11px; color: var(--t3); font-weight: 500; margin-top: 1px; }

  /* Price cell */
  .ml-price { font-family: var(--mono); font-size: 13.5px; font-weight: 600; color: var(--t1); }

  /* Change chip */
  .ml-change {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 700; font-family: var(--mono);
    padding: 3px 8px; border-radius: 6px;
  }
  .ml-change.up   { background: var(--green-l); color: #059669; }
  .ml-change.down { background: var(--red-l);   color: #dc2626; }
  .ml-change.flat { background: #f3f4f6;         color: var(--t3); }

  /* High / low */
  .ml-hl { font-family: var(--mono); font-size: 12.5px; color: var(--t2); font-weight: 500; }
  .ml-hl.high { color: #059669; }
  .ml-hl.low  { color: #dc2626; }

  /* Volume */
  .ml-vol { font-family: var(--mono); font-size: 12.5px; color: var(--t2); font-weight: 500; }

  /* Sparkline placeholder bar */
  .ml-spark {
    display: flex; align-items: flex-end; gap: 2px; height: 24px;
  }
  .ml-spark-bar {
    width: 3px; border-radius: 2px; background: var(--border);
    transition: background 0.2s;
  }
  .ml-spark-bar.up   { background: var(--green); }
  .ml-spark-bar.down { background: var(--red); }

  /* Trade button */
  .ml-trade-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--accent); color: #fff;
    border: none; border-radius: var(--r-sm);
    padding: 7px 16px; font-size: 12.5px; font-weight: 700;
    font-family: var(--font); cursor: pointer;
    box-shadow: 0 2px 8px rgba(99,102,241,0.25);
    transition: all 0.15s; white-space: nowrap;
  }
  .ml-trade-btn:hover {
    background: #4f46e5;
    box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }
  .ml-trade-btn:active { transform: translateY(0); }

  /* ── Empty state ── */
  .ml-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 32px; gap: 12px; text-align: center;
  }
  .ml-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--t3); margin-bottom: 4px;
  }
  .ml-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); }
  .ml-empty-desc  { font-size: 13px; color: var(--t2); max-width: 260px; line-height: 1.6; }
  .ml-empty-sub   { font-size: 12px; color: var(--t3); font-family: var(--mono); }

  /* No search results */
  .ml-no-results {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 32px; gap: 8px; text-align: center;
  }
  .ml-no-results-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .ml-no-results-desc  { font-size: 13px; color: var(--t2); }
  .ml-clear-btn {
    margin-top: 4px; border: 1px solid var(--border); background: none;
    border-radius: var(--r-sm); padding: 6px 14px;
    font-size: 12.5px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer; transition: all 0.15s;
  }
  .ml-clear-btn:hover { background: var(--bg); color: var(--t1); }

  /* ── Error state ── */
  .ml-error {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 32px; gap: 12px; text-align: center;
  }
  .ml-error-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: var(--red-l); border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); margin-bottom: 4px;
  }
  .ml-error-title { font-size: 15px; font-weight: 700; color: var(--t1); }
  .ml-error-desc  { font-size: 13px; color: var(--t2); max-width: 280px; line-height: 1.6; }
  .ml-retry-btn {
    margin-top: 4px; background: var(--red); color: #fff;
    border: none; border-radius: var(--r-sm); padding: 8px 18px;
    font-size: 13px; font-weight: 700; font-family: var(--font);
    cursor: pointer; transition: all 0.15s;
    box-shadow: 0 2px 8px rgba(239,68,68,0.25);
  }
  .ml-retry-btn:hover { background: #dc2626; transform: translateY(-1px); }

  /* ── Create Order button ── */
  .ml-create-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--accent); color: #fff;
    border: none; border-radius: var(--r-sm);
    padding: 8px 16px; font-size: 13px; font-weight: 700;
    font-family: var(--font); cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 10px rgba(99,102,241,0.3);
    transition: all 0.15s;
  }
  .ml-create-btn:hover {
    background: #4f46e5;
    box-shadow: 0 4px 16px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }
  .ml-create-btn:active { transform: translateY(0); }

  /* ── Modal overlay ── */
  .ml-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: mlOverlayIn 0.2s ease both;
  }
  @keyframes mlOverlayIn { from { opacity: 0; } to { opacity: 1; } }

  .ml-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    width: 100%; max-width: 480px;
    animation: mlModalIn 0.25s cubic-bezier(0.16,1,0.3,1) both;
    overflow: hidden;
  }
  @keyframes mlModalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Modal header */
  .ml-modal-hd {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--border);
  }
  .ml-modal-title { font-size: 16px; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
  .ml-modal-sub   { font-size: 12.5px; color: var(--t3); margin-top: 2px; }
  .ml-modal-close {
    width: 32px; height: 32px; border-radius: var(--r-sm);
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center;
    color: var(--t3); cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .ml-modal-close:hover { background: var(--bg); color: var(--t1); border-color: #d1d5db; }

  /* Modal body */
  .ml-modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }

  /* Buy / Sell toggle */
  .ml-type-toggle {
    display: grid; grid-template-columns: 1fr 1fr;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 4px; gap: 4px;
  }
  .ml-type-btn {
    padding: 8px; border-radius: 6px; border: none;
    font-size: 13px; font-weight: 700; font-family: var(--font);
    cursor: pointer; transition: all 0.15s; background: none; color: var(--t3);
  }
  .ml-type-btn.active-buy  { background: var(--green);   color: #fff; box-shadow: 0 2px 8px rgba(16,185,129,0.3); }
  .ml-type-btn.active-sell { background: var(--red);     color: #fff; box-shadow: 0 2px 8px rgba(239,68,68,0.3); }
  .ml-type-btn:not(.active-buy):not(.active-sell):hover { background: var(--surface); color: var(--t1); }

  /* Form fields */
  .ml-field { display: flex; flex-direction: column; gap: 6px; }
  .ml-label {
    font-size: 12px; font-weight: 700; color: var(--t2);
    letter-spacing: 0.04em; text-transform: uppercase;
  }
  .ml-input-wrap { position: relative; }
  .ml-input-prefix {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 13px; font-weight: 600; color: var(--t3);
    font-family: var(--mono); pointer-events: none;
  }
  .ml-input {
    width: 100%; border: 1px solid var(--border); border-radius: var(--r-sm);
    padding: 10px 12px; font-size: 13.5px; font-family: var(--mono);
    font-weight: 500; color: var(--t1); background: var(--surface);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .ml-input.has-prefix { padding-left: 26px; }
  .ml-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--ac-light);
  }
  .ml-select-wrap { position: relative; }
  .ml-select-wrap .ml-input { padding-right: 32px; cursor: pointer; }
  .ml-select-arrow {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    pointer-events: none; color: var(--t3);
  }

  /* Order summary strip */
  .ml-order-summary {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .ml-summary-row {
    display: flex; justify-content: space-between; align-items: center;
  }
  .ml-summary-key { font-size: 12.5px; color: var(--t3); font-weight: 500; }
  .ml-summary-val { font-size: 12.5px; font-weight: 700; color: var(--t1); font-family: var(--mono); }
  .ml-summary-val.total { font-size: 14px; color: var(--accent); }
  .ml-summary-divider { height: 1px; background: var(--border); margin: 2px 0; }

  /* Modal footer */
  .ml-modal-ft {
    display: flex; gap: 10px; justify-content: flex-end;
    padding: 16px 24px 20px;
    border-top: 1px solid var(--border);
  }
  .ml-cancel-btn {
    padding: 9px 18px; border-radius: var(--r-sm);
    border: 1px solid var(--border); background: none;
    font-size: 13px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer; transition: all 0.15s;
  }
  .ml-cancel-btn:hover { background: var(--bg); color: var(--t1); }
  .ml-submit-btn {
    padding: 9px 22px; border-radius: var(--r-sm);
    border: none; font-size: 13px; font-weight: 700;
    font-family: var(--font); cursor: pointer; transition: all 0.15s;
    color: #fff;
  }
  .ml-submit-btn.BUY { background: var(--green); box-shadow: 0 2px 8px rgba(16,185,129,0.3); }
  .ml-submit-btn.SELL { background: var(--red);   box-shadow: 0 2px 8px rgba(239,68,68,0.3); }
  .ml-submit-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }
  .ml-submit-btn:active { transform: translateY(0); }

  /* Animations */
  @keyframes mlFadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes mlPulse   { 0%,100% { opacity:1; box-shadow: 0 0 6px var(--green); } 50% { opacity:.5; box-shadow: 0 0 12px var(--green); } }
  @keyframes mlSpin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .ml-wrap { padding: 16px; }
    .ml-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .ml-header-right { width: 100%; }
    .ml-toolbar { flex-wrap: wrap; }
    .ml-search { max-width: 100%; flex: 1; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────────── */
const getPriceChange = (current, open) => {
  if (!open || open === 0) return { pct: 0, dir: 'flat' };
  const pct = ((current - open) / open) * 100;
  return { pct, dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' };
};

const formatVolume = (v) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K`;
  return `${v}`;
};

// Deterministic tiny sparkline from price data
const Sparkline = ({ market }) => {
  const bars = [0.4, 0.6, 0.5, 0.8, 0.55, 0.7, 0.9, 0.65, 0.75, 1.0];
  const { dir } = getPriceChange(market.currentPrice, market.openPrice);
  return (
    <div className="ml-spark">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`ml-spark-bar ${i >= bars.length - 3 ? dir : ''}`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
};

/* ─── Component ──────────────────────────────────────────────────────── */
export const MarketList = () => {
  const { markets, setMarkets, user, addOrder, setLoading, error, setError } = useAppContext();
  const [search, setSearch]       = useState('');
  const [spinning, setSpinning]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    marketId: '',
    orderType: 'BUY',
    quantity: '',
    pricePerUnit: '',
  });

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      setSpinning(true);
      const response = await marketAPI.getMarkets();
      setMarkets(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSpinning(false), 600);
    }
  };

  useEffect(() => { fetchMarkets(); }, []);

  const filtered = (markets || []).filter(m =>
    m.symbol?.toLowerCase().includes(search.toLowerCase())
  );

  /* Open modal pre-filled from a market row */
  const openOrderModal = (market = null) => {
    setForm({
      marketId: market ? market.id : (markets[0]?.id ?? ''),
      orderType: 'buy',
      quantity: '',
      pricePerUnit: market ? market.currentPrice.toFixed(2) : '',
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const selectedMarket = markets.find(m => String(m.id) === String(form.marketId));
  const totalAmount = (parseFloat(form.quantity) || 0) * (parseFloat(form.pricePerUnit) || 0);

  // const handleSubmit = () => {
  //   // Hook up to your orderAPI here
  //   closeModal();
  // };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!user) {
        setError('Please login to place an order');
        return;
      }
  
      try {
        const orderData = {
          user: { id: user.id },
          market: { id: form.marketId },
          quantity: parseFloat(form.quantity),
          pricePerUnit: parseFloat(form.pricePerUnit),
          orderType: form.orderType,
        };
        console.log(orderData)
        const response = await orderAPI.createOrder(orderData);
        // addOrder(response.data);
        // setForm({ quantity: '', pricePerUnit: '', orderType: 'BUY' });
  
        // if (onOrderCreated) {
        //   onOrderCreated();
        // }
        closeModal();
      } catch (err) {
        setError(err.message);
      }
    };
  

  return (
    <>
      <style>{styles}</style>
      <div className="ml-wrap">

        {/* Header */}
        <div className="ml-header">
          <div className="ml-header-left">
            <div className="ml-title">Live Markets</div>
            <div className="ml-subtitle">Real-time prices across all active trading pairs.</div>
          </div>
          <div className="ml-header-right">
            <div className="ml-live-badge">
              <span className="ml-live-dot" /> Live
            </div>
            <button className={`ml-refresh-btn${spinning ? ' spinning' : ''}`} onClick={fetchMarkets}>
              <Icon.Refresh /> Refresh
            </button>
            <button className="ml-create-btn" onClick={() => openOrderModal()}>
              <Icon.Plus /> Create Order
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="ml-toolbar">
          <div className="ml-search">
            <span className="ml-search-icon"><Icon.Search /></span>
            <input
              placeholder="Search symbol…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {!error && markets.length > 0 && (
            <div className="ml-count">
              Showing <strong>{filtered.length}</strong> of <strong>{markets.length}</strong> markets
            </div>
          )}
        </div>

        {/* Card */}
        <div className="ml-card">

          {/* Error state */}
          {error ? (
            <div className="ml-error">
              <div className="ml-error-icon"><Icon.Alert /></div>
              <div className="ml-error-title">Failed to load markets</div>
              <div className="ml-error-desc">{error}. Check your connection and try again.</div>
              <button className="ml-retry-btn" onClick={fetchMarkets}>Retry</button>
            </div>

          /* Empty — no data from API */
          ) : markets.length === 0 ? (
            <div className="ml-empty">
              <div className="ml-empty-icon"><Icon.EmptyState /></div>
              <div className="ml-empty-title">No markets available</div>
              <div className="ml-empty-desc">There are no active markets right now. Check back soon or refresh to try again.</div>
              <div className="ml-empty-sub">Last checked: {new Date().toLocaleTimeString()}</div>
            </div>

          /* No search results */
          ) : filtered.length === 0 ? (
            <div className="ml-no-results">
              <div className="ml-no-results-title">No results for "{search}"</div>
              <div className="ml-no-results-desc">Try a different symbol or clear your search.</div>
              <button className="ml-clear-btn" onClick={() => setSearch('')}>Clear search</button>
            </div>

          /* Table */
          ) : (
            <div className="ml-table-scroll">
              <table className="ml-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Open</th>
                    <th className="ml-hl high">High</th>
                    <th className="ml-hl low">Low</th>
                    <th>Volume</th>
                    <th>7d</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((market) => {
                    const { pct, dir } = getPriceChange(market.currentPrice, market.openPrice);
                    return (
                      <tr key={market.id}>
                        <td>
                          <div className="ml-symbol-cell">
                            <div className="ml-symbol-icon">{market.symbol?.slice(0, 3)}</div>
                            <div>
                              <div className="ml-symbol-name">{market.symbol}</div>
                              <div className="ml-symbol-sub">Market #{market.id}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="ml-price">${market.currentPrice.toFixed(2)}</span></td>
                        <td>
                          <span className={`ml-change ${dir}`}>
                            {dir === 'up' ? <Icon.TrendUp /> : dir === 'down' ? <Icon.TrendDown /> : null}
                            {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                          </span>
                        </td>
                        <td><span className="ml-price">${market.openPrice.toFixed(2)}</span></td>
                        <td><span className="ml-hl high">${market.highPrice.toFixed(2)}</span></td>
                        <td><span className="ml-hl low">${market.lowPrice.toFixed(2)}</span></td>
                        <td><span className="ml-vol">{formatVolume(market.volume)}</span></td>
                        <td><Sparkline market={market} /></td>
                        <td>
                          <button className="ml-trade-btn" onClick={() => openOrderModal(market)}>
                            Trade
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Create Order Modal ── */}
        {showModal && (
          <div className="ml-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="ml-modal">

              {/* Header */}
              <div className="ml-modal-hd">
                <div>
                  <div className="ml-modal-title">Create Order</div>
                  <div className="ml-modal-sub">
                    {selectedMarket ? `${selectedMarket.symbol} · $${selectedMarket.currentPrice.toFixed(2)}` : 'Place a new market order'}
                  </div>
                </div>
                <button className="ml-modal-close" onClick={closeModal}><Icon.X /></button>
              </div>

              {/* Body */}
              <div className="ml-modal-body">

                {/* Buy / Sell toggle */}
                <div className="ml-field">
                  <div className="ml-label">Order Type</div>
                  <div className="ml-type-toggle">
                    <button
                      className={`ml-type-btn ${form.orderType === 'buy' ? 'active-buy' : ''}`}
                      onClick={() => setForm(f => ({ ...f, orderType: 'BUY' }))}
                    >↑ Buy</button>
                    <button
                      className={`ml-type-btn ${form.orderType === 'sell' ? 'active-sell' : ''}`}
                      onClick={() => setForm(f => ({ ...f, orderType: 'SELL' }))}
                    >↓ Sell</button>
                  </div>
                </div>

                {/* Market selector */}
                <div className="ml-field">
                  <label className="ml-label">Market</label>
                  <div className="ml-select-wrap">
                    <select
                      className="ml-input"
                      value={form.marketId}
                      onChange={e => {
                        const m = markets.find(x => String(x.id) === e.target.value);
                        setForm(f => ({
                          ...f,
                          marketId: e.target.value,
                          pricePerUnit: m ? m.currentPrice.toFixed(2) : f.pricePerUnit,
                        }));
                      }}
                    >
                      {markets.map(m => (
                        <option key={m.id} value={m.id}>{m.symbol} — ${m.currentPrice.toFixed(2)}</option>
                      ))}
                    </select>
                    <span className="ml-select-arrow"><Icon.ChevronDown /></span>
                  </div>
                </div>

                {/* Quantity + Price row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="ml-field">
                    <label className="ml-label">Quantity</label>
                    <input
                      className="ml-input"
                      type="number"
                      min="1"
                      placeholder="0"
                      value={form.quantity}
                      onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    />
                  </div>
                  <div className="ml-field">
                    <label className="ml-label">Price / Unit</label>
                    <div className="ml-input-wrap">
                      <span className="ml-input-prefix">$</span>
                      <input
                        className="ml-input has-prefix"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={form.pricePerUnit}
                        onChange={e => setForm(f => ({ ...f, pricePerUnit: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="ml-order-summary">
                  <div className="ml-summary-row">
                    <span className="ml-summary-key">Market</span>
                    <span className="ml-summary-val">{selectedMarket?.symbol ?? '—'}</span>
                  </div>
                  <div className="ml-summary-row">
                    <span className="ml-summary-key">Quantity</span>
                    <span className="ml-summary-val">{form.quantity || '—'}</span>
                  </div>
                  <div className="ml-summary-row">
                    <span className="ml-summary-key">Price / Unit</span>
                    <span className="ml-summary-val">{form.pricePerUnit ? `$${parseFloat(form.pricePerUnit).toFixed(2)}` : '—'}</span>
                  </div>
                  <div className="ml-summary-divider" />
                  <div className="ml-summary-row">
                    <span className="ml-summary-key">Estimated Total</span>
                    <span className="ml-summary-val total">
                      {totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : '—'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="ml-modal-ft">
                <button className="ml-cancel-btn" onClick={closeModal}>Cancel</button>
                <button
                  className={`ml-submit-btn ${form.orderType}`}
                  onClick={handleSubmit}
                  disabled={!form.quantity || !form.pricePerUnit}
                >
                  {form.orderType === 'BUY' ? '↑ Place Buy Order' : '↓ Place Sell Order'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
};
