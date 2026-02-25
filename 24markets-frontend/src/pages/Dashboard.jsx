import React, { useEffect, useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { orderAPI } from '../services/api';
import { NavLink, useNavigate } from "react-router-dom";
/* ─── SVG Icon Set ─────────────────────────────────────────────────── */
const Icon = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Orders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12a2 2 0 002 2h14v-4"/>
      <circle cx="16" cy="14" r="1" fill="currentColor"/>
    </svg>
  ),
  Chart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Filter: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Export: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Lock: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
};

/* ─── Styles ───────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --sw: 232px;
    --th: 64px;
    --bg:       #f4f5f7;
    --surface:  #ffffff;
    --sf-hover: #f9fafb;
    --sb-bg:    #0f1117;
    --sb-hover: rgba(255,255,255,0.06);
    --sb-active:rgba(99,102,241,0.16);
    --border:   #e5e7eb;
    --border-xs:rgba(0,0,0,0.05);
    --accent:   #6366f1;
    --ac-light: rgba(99,102,241,0.1);
    --ac-glow:  rgba(99,102,241,0.25);
    --green:    #10b981;
    --green-l:  rgba(16,185,129,0.1);
    --red:      #ef4444;
    --red-l:    rgba(239,68,68,0.1);
    --amber:    #f59e0b;
    --amber-l:  rgba(245,158,11,0.1);
    --blue:     #3b82f6;
    --blue-l:   rgba(59,130,246,0.1);
    --t1: #111827;
    --t2: #6b7280;
    --t3: #9ca3af;
    --ts: #a1a1aa;
    --ts-a: #ffffff;
    --sh-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --sh-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
    --sh-lg: 0 10px 40px rgba(0,0,0,0.12);
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 20px;
    --font: 'Plus Jakarta Sans', system-ui, sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  .db-shell {
    display: flex; min-height: 100vh;
    font-family: var(--font); color: var(--t1); background: var(--bg);
  }

  /* Sidebar */
  .db-sidebar {
    width: var(--sw); background: var(--sb-bg);
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; overflow: hidden;
  }
  .db-sidebar::after {
    content: ''; position: absolute; top: 0; right: 0;
    width: 1px; height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent);
  }

  .db-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 20px; height: var(--th); flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .db-logo-mark {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 14px; color: #fff; letter-spacing: -0.04em;
    box-shadow: 0 4px 12px rgba(99,102,241,0.4);
  }
  .db-logo-text { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
  .db-logo-text span { color: #a5b4fc; }

  .db-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  .db-nav-label {
    font-family: var(--mono); font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); padding: 0 8px; margin: 14px 0 6px;
  }
  .db-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: var(--r-sm);
    font-size: 13.5px; font-weight: 500; color: var(--ts);
    cursor: pointer; transition: background 0.15s, color 0.15s;
    position: relative; border: none; background: none; text-align: left; width: 100%;
  }
  .db-nav-item:hover { background: var(--sb-hover); color: #e5e7eb; }
  .db-nav-item.active { background: var(--sb-active); color: var(--ts-a); }
  .db-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
    width: 3px; background: var(--accent); border-radius: 0 3px 3px 0;
    box-shadow: 0 0 8px var(--ac-glow);
  }
  .db-nav-icon { flex-shrink: 0; opacity: 0.65; }
  .db-nav-item.active .db-nav-icon, .db-nav-item:hover .db-nav-icon { opacity: 1; }
  .db-nav-badge {
    margin-left: auto; background: var(--accent); color: #fff;
    font-size: 10px; font-weight: 700; padding: 2px 7px;
    border-radius: 100px; min-width: 20px; text-align: center;
  }

  .db-sb-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; }
  .db-sb-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: var(--r-sm); cursor: pointer;
    transition: background 0.15s;
  }
  .db-sb-user:hover { background: var(--sb-hover); }
  .db-sb-avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, #6366f1, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
  }
  .db-sb-name { font-size: 13px; font-weight: 600; color: #e5e7eb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-sb-role { font-size: 11px; color: rgba(255,255,255,0.28); }
  .db-sb-logout { margin-left: auto; color: rgba(255,255,255,0.22); display: flex; flex-shrink: 0; transition: color 0.15s; }
  .db-sb-user:hover .db-sb-logout { color: rgba(255,255,255,0.55); }

  /* Main */
  .db-main { margin-left: var(--sw); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* Topbar */
  .db-topbar {
    height: var(--th); background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 16px;
    padding: 0 28px; position: sticky; top: 0; z-index: 50;
    box-shadow: var(--sh-sm);
  }
  .db-crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--t3); }
  .db-crumb-sep { font-size: 15px; color: var(--border); }
  .db-crumb-cur { color: var(--t1); font-weight: 600; }

  .db-search {
    margin-left: auto; display: flex; align-items: center; gap: 8px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 7px 12px; width: 220px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .db-search:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--ac-light); }
  .db-search input {
    border: none; background: none; outline: none;
    font-size: 13px; color: var(--t1); font-family: var(--font); width: 100%;
  }
  .db-search input::placeholder { color: var(--t3); }

  .db-tb-actions { display: flex; align-items: center; gap: 6px; }
  .db-icon-btn {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    border: none; background: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--t2); transition: background 0.15s, color 0.15s; position: relative;
  }
  .db-icon-btn:hover { background: var(--bg); color: var(--t1); }
  .db-notif-dot {
    position: absolute; top: 7px; right: 7px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--red); border: 2px solid var(--surface);
  }
  .db-tb-div { width: 1px; height: 28px; background: var(--border); flex-shrink: 0; }
  .db-tb-avatar {
    width: 34px; height: 34px; border-radius: 9px; cursor: pointer;
    background: linear-gradient(135deg, var(--accent), #818cf8);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff;
    box-shadow: 0 2px 8px rgba(99,102,241,0.3);
  }

  /* Content */
  .db-content { padding: 28px; flex: 1; animation: fadeIn 0.4s ease both; }

  .db-ph { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .db-ph-title { font-size: 22px; font-weight: 800; letter-spacing: -0.03em; color: var(--t1); margin-bottom: 3px; }
  .db-ph-sub { font-size: 13px; color: var(--t2); }
  .db-live-badge {
    display: flex; align-items: center; gap: 7px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 7px 14px;
    font-size: 12.5px; color: var(--t2); font-weight: 500;
    box-shadow: var(--sh-sm);
  }
  .db-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 6px var(--green);
    animation: livePulse 2s infinite; flex-shrink: 0;
  }

  /* Stat cards */
  .db-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .db-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 20px 22px;
    box-shadow: var(--sh-sm);
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .db-stat::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; opacity: 0; transition: opacity 0.2s;
  }
  .db-stat.ci::after { background: linear-gradient(90deg, #6366f1, #818cf8); }
  .db-stat.cg::after { background: linear-gradient(90deg, #10b981, #34d399); }
  .db-stat.ca::after { background: linear-gradient(90deg, #f59e0b, #fcd34d); }
  .db-stat.cb::after { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
  .db-stat:hover { box-shadow: var(--sh-md); transform: translateY(-2px); border-color: #d1d5db; }
  .db-stat:hover::after { opacity: 1; }

  .db-stat-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .db-stat-lbl { font-size: 11.5px; font-weight: 600; color: var(--t2); letter-spacing: 0.02em; text-transform: uppercase; }
  .db-stat-ico {
    width: 36px; height: 36px; border-radius: var(--r-sm);
    display: flex; align-items: center; justify-content: center;
  }
  .db-stat-ico.ci { background: var(--ac-light); color: var(--accent); }
  .db-stat-ico.cg { background: var(--green-l);  color: var(--green); }
  .db-stat-ico.ca { background: var(--amber-l);  color: var(--amber); }
  .db-stat-ico.cb { background: var(--blue-l);   color: var(--blue);  }

  .db-stat-val { font-size: 26px; font-weight: 800; letter-spacing: -0.04em; color: var(--t1); line-height: 1; margin-bottom: 8px; }
  .db-stat-chg { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; }
  .db-stat-chg.up   { color: var(--green); }
  .db-stat-chg.down { color: var(--red); }
  .db-stat-chg-lbl { font-size: 12px; color: var(--t3); margin-left: 3px; font-weight: 400; }

  /* Mid row */
  .db-mid { display: grid; grid-template-columns: 272px 1fr; gap: 16px; }

  /* ── Profile card — clean minimal ── */
  .db-pcard {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    box-shadow: var(--sh-sm);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* Top identity block */
  .db-p-identity {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 24px 24px;
    border-bottom: 1px solid var(--border);
  }

  /* Simple circle avatar with accent ring */
  .db-p-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: var(--ac-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 800; color: var(--accent); letter-spacing: -0.03em;
    border: 2px solid rgba(99,102,241,0.2);
    margin-bottom: 14px;
    flex-shrink: 0;
  }

  .db-p-name {
    font-size: 15px; font-weight: 700; color: var(--t1);
    letter-spacing: -0.02em; margin-bottom: 4px;
  }
  .db-p-email {
    font-size: 12.5px; color: var(--t3); margin-bottom: 14px;
    word-break: break-all;
  }

  /* Status chip */
  .db-p-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11.5px; font-weight: 600; color: #059669;
    background: var(--green-l); border: 1px solid rgba(16,185,129,0.18);
    padding: 3px 11px; border-radius: 100px;
  }
  .db-p-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); flex-shrink: 0;
    animation: livePulse 2s infinite;
  }

  /* Stats strip — 2 columns, no background, just numbers */
  .db-p-stats {
    display: grid; grid-template-columns: 1fr 1fr;
  }
  .db-p-stat-cell {
    padding: 18px 0;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    border-bottom: 1px solid var(--border);
  }
  .db-p-stat-cell:nth-child(odd) { border-right: 1px solid var(--border); }
  .db-p-stat-val {
    font-family: var(--mono); font-size: 14px; font-weight: 700;
    color: var(--t1); letter-spacing: -0.02em;
  }
  .db-p-stat-val.green  { color: var(--green); }
  .db-p-stat-val.accent { color: var(--accent); }
  .db-p-stat-lbl {
    font-size: 10.5px; font-weight: 600; color: var(--t3);
    text-transform: uppercase; letter-spacing: 0.07em;
  }

  /* Meta rows */
  .db-p-meta { padding: 16px 24px 20px; display: flex; flex-direction: column; gap: 0; }
  .db-p-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 0; border-bottom: 1px solid var(--border-xs);
  }
  .db-p-row:last-child { border-bottom: none; }
  .db-p-key { font-size: 12.5px; color: var(--t3); font-weight: 500; }
  .db-p-val { font-size: 12.5px; font-weight: 600; color: var(--t1); font-family: var(--mono); }

  /* Orders card */
  .db-ocard {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); box-shadow: var(--sh-sm);
    overflow: hidden; display: flex; flex-direction: column;
  }
  .db-o-hd {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .db-o-title { font-size: 14.5px; font-weight: 700; color: var(--t1); letter-spacing: -0.01em; }
  .db-o-count {
    margin-left: 8px; font-size: 12px; font-weight: 600; color: var(--t3);
    background: var(--bg); padding: 2px 8px; border-radius: 100px; border: 1px solid var(--border);
  }
  .db-o-acts { display: flex; align-items: center; gap: 8px; }

  .db-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: var(--r-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
  }
  .db-btn-ghost { background: none; border-color: var(--border); color: var(--t2); }
  .db-btn-ghost:hover { background: var(--bg); color: var(--t1); }
  .db-btn-primary { background: var(--accent); color: #fff; box-shadow: 0 2px 8px rgba(99,102,241,0.28); }
  .db-btn-primary:hover { background: #4f46e5; box-shadow: 0 4px 12px rgba(99,102,241,0.4); transform: translateY(-1px); }

  /* Table */
  .db-t-scroll { overflow-x: auto; }
  .db-table { width: 100%; border-collapse: collapse; }
  .db-table th {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--t3);
    padding: 11px 16px; text-align: left;
    background: #fafafa; border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  .db-table th:first-child { padding-left: 22px; }
  .db-table th:last-child  { padding-right: 22px; }
  .db-table td {
    padding: 13px 16px; font-size: 13.5px; color: var(--t1);
    border-bottom: 1px solid var(--border-xs); vertical-align: middle;
  }
  .db-table td:first-child { padding-left: 22px; }
  .db-table td:last-child  { padding-right: 22px; }
  .db-table tbody tr:last-child td { border-bottom: none; }
  .db-table tbody tr { transition: background 0.12s; cursor: default; }
  .db-table tbody tr:hover { background: var(--sf-hover); }

  .db-oid {
    font-family: var(--mono); font-size: 12px; font-weight: 500; color: var(--t3);
    background: var(--bg); padding: 3px 8px; border-radius: 5px; border: 1px solid var(--border);
  }
  .db-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 6px;
    font-size: 11.5px; font-weight: 600; letter-spacing: 0.02em;
    border: 1px solid transparent;
  }
  .db-bdot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .db-badge.buy        { background: var(--green-l);  color: var(--green); border-color: rgba(16,185,129,0.2); }
  .db-badge.sell       { background: var(--red-l);    color: var(--red);   border-color: rgba(239,68,68,0.2); }
  .db-badge.completed  { background: var(--green-l);  color: #059669;      border-color: rgba(16,185,129,0.2); }
  .db-badge.pending    { background: var(--amber-l);  color: #d97706;      border-color: rgba(245,158,11,0.2); }
  .db-badge.failed     { background: var(--red-l);    color: #dc2626;      border-color: rgba(239,68,68,0.2); }
  .db-badge.cancelled  { background: #f3f4f6;         color: #6b7280;      border-color: var(--border); }

  .db-num { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--t1); }
  .db-num.bold { font-weight: 700; }
  .db-date-c { font-size: 12.5px; color: var(--t2); }

  /* Empty */
  .db-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 32px; gap: 10px; text-align: center;
  }
  .db-empty-ico {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--t3); margin-bottom: 4px;
  }
  .db-empty-t  { font-size: 15px; font-weight: 700; color: var(--t1); }
  .db-empty-d  { font-size: 13px; color: var(--t2); max-width: 220px; }

  /* Login */
  .db-login {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; background: var(--bg); font-family: var(--font);
  }
  .db-login-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-xl); padding: 48px; text-align: center;
    max-width: 360px; width: 100%; box-shadow: var(--sh-lg);
  }
  .db-login-ico {
    width: 64px; height: 64px; border-radius: 18px;
    background: var(--ac-light); display: flex; align-items: center;
    justify-content: center; margin: 0 auto 20px; color: var(--accent);
  }
  .db-login-t { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.03em; margin-bottom: 8px; }
  .db-login-d { font-size: 14px; color: var(--t2); }

  /* Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes livePulse {
    0%,100% { opacity: 1; box-shadow: 0 0 6px var(--green); }
    50%      { opacity: 0.5; box-shadow: 0 0 12px var(--green); }
  }

  @media (max-width: 1100px) {
    .db-stats { grid-template-columns: repeat(2,1fr); }
    .db-mid   { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    :root { --sw: 0px; }
    .db-sidebar { display: none; }
    .db-main { margin-left: 0; }
    .db-content { padding: 16px; }
    .db-stats { grid-template-columns: repeat(2,1fr); gap: 12px; }
    .db-topbar { padding: 0 16px; }
    .db-search { display: none; }
    .db-ph { flex-direction: column; gap: 12px; }
  }
`;

/* ─── Component ────────────────────────────────────────────────────── */
export const Dashboard = () => {
  const { user, orders, setOrders, setLoading, error, setError, logoutUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          // console.log(localStorage.getItem("token"))                 
          const response = await orderAPI.getRecentsOrders();
          setOrders(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user, setOrders, setLoading, setError]);

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="db-login">
          <div className="db-login-card">
            <div className="db-login-ico"><Icon.Lock /></div>
            <div className="db-login-t">Authentication Required</div>
            <div className="db-login-d">Please sign in to access your dashboard and order history.</div>
          </div>
        </div>
      </>
    );
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const completedOrders = orders.filter(o => o.status?.toLowerCase() === 'completed').length;
  const totalVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const buyOrders = orders.filter(o => o.orderType?.toLowerCase() === 'buy').length;
  const firstName = user.fullName?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const typeClass   = (t) => t?.toLowerCase() === 'buy' ? 'buy' : 'sell';
  const statusClass = (s) => {
    const v = s?.toLowerCase();
    return ['completed','pending','failed','cancelled'].includes(v) ? v : '';
  };

  return (
    <>
      <style>{styles}</style>
      <div className="db-shell">

        {/* Sidebar */}
        <aside className="db-sidebar">
          <div className="db-logo">
            <div className="db-logo-mark">T</div>
            <div className="db-logo-text">Trade<span>Hub</span></div>
          </div>
          <nav className="db-nav">          
            <div className="db-nav-label" style={{ marginTop: 20 }}>Account</div>
            {[
              { icon: <Icon.Dashboard />, label: "Overview", link: "/dashboard" },
              // { icon: <Icon.Orders />, label: "Orders", badge: orders?.length || 0, link: "/orders" },
              ...(user?.role == "ROLE_ADMIN" ? [] : [{ icon: <Icon.Orders />, label: "Orders", badge: orders?.length || 0, link: "/orders" }]),
               { icon: <Icon.Orders />, label: "Markets", link: "/markets" },
              ...(user?.role == "ROLE_ADMIN" ? [{ icon: <Icon.Orders />, label: "Users", link: "/users" }] : []),
              ...(user?.role == "ROLE_ADMIN" ? [{ icon: <Icon.Orders />, label: "Users Orders", link: "/usersOrders" }] : []),
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.link}
                className={({ isActive }) =>
                  `db-nav-item ${isActive ? "active" : ""}`
                }
              >
                <span className="db-nav-icon">{item.icon}</span>
                {item.label}

                {item.badge > 0 && (
                  <span className="db-nav-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}

          </nav>
          <div className="db-sb-footer">
            <div className="db-sb-user">
              <div className="db-sb-avatar">{initials}</div>

              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div className="db-sb-name">{user?.fullName}</div>
                <div className="db-sb-role">{user?.role == "ROLE_ADMIN" ? 'Admin' : 'Member'}</div>
              </div>

              <div
                className="db-sb-logout"
                onClick={() => {
                  handleLogout();
                }}
                style={{ cursor: 'pointer' }}
                title="Logout"
              >
                <Icon.Logout />
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="db-main">

          {/* Topbar */}
          <header className="db-topbar">
            <div className="db-crumb">
              <span>TradeHub</span>
              <span className="db-crumb-sep">/</span>
              <span className="db-crumb-cur">Overview</span>
            </div>

            <div className="db-search">
              <Icon.Search />
              <input placeholder="Search orders..." />
            </div>

            <div className="db-tb-actions">
              {/* <button className="db-icon-btn">
                <Icon.Bell />
                <span className="db-notif-dot" />
              </button> */}
              {/* <button className="db-icon-btn"><Icon.Settings /></button> */}
              {/* <div className="db-tb-div" /> */}
              <div className="db-tb-avatar">{initials}</div>
            </div>
          </header>

          {/* Content */}
          <main className="db-content">

            {/* Page header */}
            <div className="db-ph">
              <div>
                <div className="db-ph-title">Good morning, {firstName} {user?.role == "ROLE_ADMIN" && <span style={{color: 'var(--accent)', fontSize: '20px', fontWeight: '600'}}> (ADMIN)</span>} 👋</div>
                <div className="db-ph-sub">Here's what's happening with your portfolio today.</div>
              </div>
              <div className="db-live-badge">
                <span className="db-live-dot" />
                {today}
              </div>
            </div>

            {/* Stats row */}
            <div className="db-stats">
              <div className="db-stat ci">
                <div className="db-stat-hd">
                  <div className="db-stat-lbl">Wallet Balance</div>
                  <div className="db-stat-ico ci"><Icon.Wallet /></div>
                </div>
                <div className="db-stat-val">${user.walletBalance.toFixed(2)}</div>
                <span className="db-stat-chg up"><Icon.TrendUp /> +2.4% <span className="db-stat-chg-lbl">vs last month</span></span>
              </div>

              <div className="db-stat cg">
                <div className="db-stat-hd">
                  <div className="db-stat-lbl">Total Volume</div>
                  <div className="db-stat-ico cg"><Icon.Chart /></div>
                </div>
                <div className="db-stat-val">${totalVolume.toFixed(2)}</div>
                <span className="db-stat-chg up"><Icon.TrendUp /> +12.1% <span className="db-stat-chg-lbl">vs last month</span></span>
              </div>

              <div className="db-stat ca">
                <div className="db-stat-hd">
                  <div className="db-stat-lbl">Total Orders</div>
                  <div className="db-stat-ico ca"><Icon.Orders /></div>
                </div>
                <div className="db-stat-val">{orders.length}</div>
                <span className="db-stat-chg up"><Icon.TrendUp /> {completedOrders} completed <span className="db-stat-chg-lbl">overall</span></span>
              </div>

              <div className="db-stat cb">
                <div className="db-stat-hd">
                  <div className="db-stat-lbl">Buy Orders</div>
                  <div className="db-stat-ico cb"><Icon.Dashboard /></div>
                </div>
                <div className="db-stat-val">{buyOrders}</div>
                <span className="db-stat-chg up"><Icon.TrendUp /> {orders.length - buyOrders} sells <span className="db-stat-chg-lbl">alongside</span></span>
              </div>
            </div>

            {/* Mid: profile + orders */}
            <div className="db-mid">

              {/* Profile */}
              <div className="db-pcard">

                {/* Identity block — centered, no banner */}
                <div className="db-p-identity">
                  <div className="db-p-avatar">{initials}</div>
                  <div className="db-p-name">{user.fullName}</div>
                  <div className="db-p-email">{user.email}</div>
                  <div className="db-p-status">
                    <span className="db-p-status-dot" />
                    Active
                  </div>
                </div>

                {/* Stats strip */}
                <div className="db-p-stats">
                  <div className="db-p-stat-cell">
                    <div className="db-p-stat-val green">${user.walletBalance.toFixed(2)}</div>
                    <div className="db-p-stat-lbl">Balance</div>
                  </div>
                  <div className="db-p-stat-cell">
                    <div className="db-p-stat-val accent">{orders.length}</div>
                    <div className="db-p-stat-lbl">Orders</div>
                  </div>
                  <div className="db-p-stat-cell">
                    <div className="db-p-stat-val">{completedOrders}</div>
                    <div className="db-p-stat-lbl">Completed</div>
                  </div>
                  <div className="db-p-stat-cell">
                    <div className="db-p-stat-val">${totalVolume.toFixed(2)}</div>
                    <div className="db-p-stat-lbl">Volume</div>
                  </div>
                </div>

                {/* Meta rows */}
                <div className="db-p-meta">
                  <div className="db-p-row">
                    <span className="db-p-key">Member since</span>
                    <span className="db-p-val">Jan 2024</span>
                  </div>
                  <div className="db-p-row">
                    <span className="db-p-key">Buy orders</span>
                    <span className="db-p-val">{buyOrders}</span>
                  </div>
                  <div className="db-p-row">
                    <span className="db-p-key">Sell orders</span>
                    <span className="db-p-val">{orders.length - buyOrders}</span>
                  </div>
                  <div className="db-p-row">
                    <span className="db-p-key">Success rate</span>
                    <span className="db-p-val">
                      {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Orders table */}
              <div className="db-ocard">
                <div className="db-o-hd">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="db-o-title">Recent Orders</span>
                    <span className="db-o-count">{orders.length}</span>
                  </div>
                  <div className="db-o-acts">
                    <button className="db-btn db-btn-ghost"><Icon.Filter /> Filter</button>
                    <button className="db-btn db-btn-primary"><Icon.Export /> Export</button>
                  </div>
                </div>

                <div className="db-t-scroll">
                  {orders.length === 0 ? (
                    <div className="db-empty">
                      <div className="db-empty-ico"><Icon.Orders /></div>
                      <div className="db-empty-t">No orders yet</div>
                      <div className="db-empty-d">Your order history will appear here once you start trading.</div>
                    </div>
                  ) : (
                    <table className="db-table">
                      <thead>
                        <tr>
                          <th>Order ID</th><th>Type</th><th>Quantity</th>
                          <th>Price / Unit</th><th>Total</th><th>Status</th><th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td><span className="db-oid">#{order.id}</span></td>
                            <td>
                              <span className={`db-badge ${typeClass(order.orderType)}`}>
                                <span className="db-bdot" />{order.orderType}
                              </span>
                            </td>
                            <td><span className="db-num">{order.quantity}</span></td>
                            <td><span className="db-num">${order.pricePerUnit.toFixed(2)}</span></td>
                            <td><span className="db-num bold">${order.totalAmount.toFixed(2)}</span></td>
                            <td>
                              <span className={`db-badge ${statusClass(order.status)}`}>
                                <span className="db-bdot" />{order.status}
                              </span>
                            </td>
                            <td>
                              <span className="db-date-c">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
