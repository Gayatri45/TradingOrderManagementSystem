import { useState, useMemo, useEffect, useCallback } from 'react'

// ─── API ──────────────────────────────────────────────────────────────────────
import { marketAPI, orderAPI } from '../services/api';
import { useAppContext } from '../hooks/useAppContext';

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmt = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtDate = (dt) => {
  const d = new Date(dt)
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

const MARKET_COLORS = {
  AAPL:  { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  TSLA:  { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
  GOOGL: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  NVDA:  { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  AMZN:  { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  META:  { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' },
}
const mc = (symbol) => MARKET_COLORS[symbol] || { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' }

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f1f5f9; color: #0f172a; font-family: 'Inter', sans-serif; min-height: 100vh; }
  button { font-family: 'Inter', sans-serif; cursor: pointer; }
  select { font-family: 'Inter', sans-serif; }
  input  { font-family: 'Inter', sans-serif; }

  .op-page { padding: 36px 40px 64px; max-width: 1280px; margin: 0 auto; }

  @keyframes op-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  /* Heading */
  .op-heading { margin-bottom: 28px; animation: op-up .35s ease both; display:flex; align-items:flex-start; justify-content:space-between; }
  .op-heading-left {}
  .op-title {
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800;
    color: #0f172a; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;
  }
  .op-title-accent { color: #2563eb; }
  .op-subtitle { color: #64748b; font-size: 13px; margin-top: 4px; }

  /* Create Order Button */
  .op-create-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 8px;
    background: #2563eb; border: none; color: #fff;
    font-size: 13px; font-weight: 600; letter-spacing: .01em;
    box-shadow: 0 1px 4px rgba(37,99,235,.25);
    transition: background .15s, box-shadow .15s, transform .1s;
    flex-shrink: 0;
  }
  .op-create-btn:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,.35); transform: translateY(-1px); }
  .op-create-btn:active { transform: translateY(0); }
  .op-create-btn-icon { font-size: 16px; line-height: 1; }

  /* Stats */
  .op-stats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
    margin-bottom: 24px; animation: op-up .35s .06s ease both;
  }
  .op-stat {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
    padding: 18px 20px; position: relative; overflow: hidden;
    transition: box-shadow .2s, border-color .2s;
  }
  .op-stat:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); border-color: #cbd5e1; }
  .op-stat::after { content:''; position:absolute; bottom:0;left:0;right:0; height:3px; }
  .op-stat.blue::after  { background:#2563eb; }
  .op-stat.green::after { background:#16a34a; }
  .op-stat.red::after   { background:#e11d48; }
  .op-stat.amber::after { background:#d97706; }
  .op-stat-label { font-size:11px; font-weight:600; color:#94a3b8; letter-spacing:.06em; text-transform:uppercase; margin-bottom:6px; }
  .op-stat-value { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#0f172a; letter-spacing:-.5px; }
  .op-stat-value.blue  { color:#2563eb; }
  .op-stat-value.green { color:#16a34a; }
  .op-stat-value.red   { color:#e11d48; }
  .op-stat-value.amber { color:#d97706; }
  .op-stat-sub { font-size:11px; color:#94a3b8; margin-top:3px; }

  /* Filters */
  .op-filters {
    display:flex; align-items:center; gap:10px; margin-bottom:14px;
    flex-wrap:wrap; animation:op-up .35s .12s ease both;
  }
  .op-fg { display:flex; gap:4px; }
  .op-fb {
    font-size:12px; font-weight:500; padding:7px 14px;
    border-radius:6px; border:1px solid #e2e8f0; background:#fff; color:#64748b;
    transition:all .15s;
  }
  .op-fb:hover { border-color:#cbd5e1; color:#0f172a; }
  .op-fb.a-all  { background:#f1f5f9; border-color:#cbd5e1; color:#0f172a; font-weight:600; }
  .op-fb.a-buy  { background:#eff6ff; border-color:#93c5fd; color:#2563eb; font-weight:600; }
  .op-fb.a-sell { background:#fff1f2; border-color:#fda4af; color:#e11d48; font-weight:600; }

  .op-search { flex:1; position:relative; min-width:200px; }
  .op-si { position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:15px;pointer-events:none; }
  .op-si-input {
    width:100%; background:#fff; border:1px solid #e2e8f0; border-radius:6px;
    padding:7px 12px 7px 34px; font-size:13px; color:#0f172a; outline:none;
    transition:border-color .15s, box-shadow .15s;
  }
  .op-si-input::placeholder { color:#94a3b8; }
  .op-si-input:focus { border-color:#93c5fd; box-shadow:0 0 0 3px rgba(37,99,235,.08); }

  /* Table card */
  .op-card {
    background:#fff; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;
    box-shadow:0 1px 4px rgba(0,0,0,.04); animation:op-up .35s .18s ease both;
  }
  .op-table { width:100%; border-collapse:collapse; }
  .op-thead { background:#f8fafc; }
  .op-thead tr { border-bottom:1px solid #e2e8f0; }
  .op-th {
    font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase;
    color:#94a3b8; padding:12px 18px; text-align:left; white-space:nowrap;
    user-select:none; transition:color .15s;
  }
  .op-th.s { cursor:pointer; }
  .op-th.s:hover { color:#64748b; }
  .op-th.sa { color:#2563eb !important; }
  .op-sarrow { margin-left:4px; font-size:10px; }

  @keyframes op-row { from{opacity:0;transform:translateX(-4px)} to{opacity:1;transform:translateX(0)} }
  .op-tbody tr {
    border-bottom:1px solid #f1f5f9; transition:background .12s;
    cursor:pointer; animation:op-row .28s ease both;
  }
  .op-tbody tr:last-child { border-bottom:none; }
  .op-tbody tr:hover { background:#f8fafc; }
  .op-tbody td { padding:14px 18px; font-size:13px; vertical-align:middle; }

  .op-oid { color:#94a3b8; font-size:12px; font-weight:500; }
  .op-mcell { display:flex; align-items:center; gap:10px; }
  .op-mchip { padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; border:1px solid transparent; flex-shrink:0; }
  .op-msym  { font-weight:600; font-size:13px; color:#0f172a; }
  .op-mname { color:#94a3b8; font-size:11px; margin-top:1px; }

  .op-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 9px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:.04em; white-space:nowrap; border:1px solid transparent;
  }
  .op-dot { width:5px; height:5px; border-radius:50%; background:currentColor; flex-shrink:0; }
  .op-dot.bl { animation:op-blink 1.4s ease-in-out infinite; }
  @keyframes op-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
  .op-badge.buy       { background:#eff6ff; color:#2563eb; border-color:#bfdbfe; }
  .op-badge.sell      { background:#fff1f2; color:#e11d48; border-color:#fecdd3; }
  .op-badge.pending   { background:#fffbeb; color:#d97706; border-color:#fde68a; }
  .op-badge.completed { background:#f0fdf4; color:#16a34a; border-color:#bbf7d0; }
  .op-badge.cancelled { background:#f8fafc; color:#94a3b8; border-color:#e2e8f0; }

  .op-qty  { font-weight:700; font-size:14px; color:#0f172a; }
  .op-unit { color:#94a3b8; font-size:11px; margin-left:2px; }
  .op-price { color:#64748b; }
  .op-tot  { font-weight:700; font-size:13px; }
  .op-tot.buy  { color:#16a34a; }
  .op-tot.sell { color:#e11d48; }
  .op-date { color:#475569; font-size:12px; }
  .op-time { color:#94a3b8; font-size:11px; margin-top:1px; }

  /* Pagination */
  .op-pager {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 18px; border-top:1px solid #f1f5f9; background:#fafafa;
    font-size:12px; color:#94a3b8;
  }
  .op-pbtns { display:flex; gap:4px; }
  .op-pb {
    width:30px; height:30px; display:flex; align-items:center; justify-content:center;
    border-radius:6px; border:1px solid #e2e8f0; background:#fff; color:#64748b;
    font-size:12px; font-weight:500; cursor:pointer; transition:all .15s;
  }
  .op-pb:hover:not(:disabled) { border-color:#93c5fd; color:#2563eb; background:#eff6ff; }
  .op-pb:disabled { opacity:.35; cursor:not-allowed; }
  .op-pb.active { background:#2563eb; border-color:#2563eb; color:#fff; font-weight:600; }

  /* Empty / Loading / Error */
  .op-empty { padding:72px 20px; text-align:center; }
  .op-empty-icon { font-size:36px; opacity:.2; margin-bottom:10px; }
  .op-empty-text { color:#94a3b8; font-size:13px; }
  .op-loading { padding:80px 20px; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .op-spinner {
    width:30px; height:30px; border-radius:50%;
    border:3px solid #e2e8f0; border-top-color:#2563eb;
    animation:op-spin .7s linear infinite;
  }
  @keyframes op-spin { to{transform:rotate(360deg)} }
  .op-ltxt { color:#94a3b8; font-size:13px; }
  .op-err {
    margin-bottom:20px; padding:13px 16px;
    background:#fff1f2; border:1px solid #fecdd3; border-radius:8px;
    color:#e11d48; font-size:13px; display:flex; align-items:center; gap:8px;
  }

  /* Detail Modal */
  .op-overlay {
    position:fixed; inset:0; background:rgba(15,23,42,.5);
    backdrop-filter:blur(4px); z-index:1000;
    display:flex; align-items:center; justify-content:center; padding:20px;
    animation:op-fi .2s ease;
  }
  @keyframes op-fi { from{opacity:0} to{opacity:1} }
  .op-modal {
    background:#fff; border-radius:16px; width:100%; max-width:500px;
    box-shadow:0 20px 60px rgba(0,0,0,.15); overflow:hidden;
    animation:op-su .25s ease;
  }
  @keyframes op-su {
    from{opacity:0;transform:translateY(16px) scale(.98)}
    to  {opacity:1;transform:translateY(0) scale(1)}
  }
  .op-mhdr {
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 22px; border-bottom:1px solid #f1f5f9;
  }
  .op-mtitle {
    font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#0f172a;
    display:flex; align-items:center; gap:8px;
  }
  .op-mid { color:#94a3b8; font-size:13px; font-weight:400; }
  .op-mclose {
    width:30px; height:30px; display:flex; align-items:center; justify-content:center;
    border-radius:7px; border:1px solid #e2e8f0; background:transparent; color:#64748b;
    font-size:17px; line-height:1; transition:all .15s;
  }
  .op-mclose:hover { background:#f8fafc; color:#0f172a; border-color:#cbd5e1; }
  .op-mbody { padding:22px; }
  .op-mload { display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px 20px; }

  .op-hero {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:20px; padding-bottom:18px; border-bottom:1px solid #f1f5f9;
  }
  .op-hmarket { display:flex; align-items:center; gap:12px; }
  .op-hchip { padding:7px 11px; border-radius:8px; font-size:14px; font-weight:800; border:1px solid transparent; }
  .op-hsym  { font-size:19px; font-weight:700; color:#0f172a; }
  .op-hname { color:#94a3b8; font-size:12px; }
  .op-hbadges { display:flex; flex-direction:column; align-items:flex-end; gap:6px; }

  .op-dgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; }
  .op-ditem { background:#f8fafc; border:1px solid #f1f5f9; border-radius:8px; padding:13px; }
  .op-ditem.full { grid-column:span 2; }
  .op-dkey { font-size:10px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.07em; margin-bottom:4px; }
  .op-dval { font-size:14px; font-weight:600; color:#0f172a; }
  .op-dval.green { color:#16a34a; }
  .op-dval.red   { color:#e11d48; }
  .op-dval.blue  { color:#2563eb; }
  .op-dval.big   { font-size:21px; }

  .op-ddates { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .op-ddate { background:#f8fafc; border:1px solid #f1f5f9; border-radius:8px; padding:13px; }
  .op-ddkey { font-size:10px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.07em; margin-bottom:4px; }
  .op-ddval { font-size:12px; font-weight:500; color:#475569; line-height:1.6; }

  /* ── Create Order Modal ── */
  .co-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,.5);
    backdrop-filter: blur(4px); z-index: 1100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: op-fi .2s ease;
  }
  .co-modal {
    background: #fff; border-radius: 16px; width: 100%; max-width: 480px;
    box-shadow: 0 20px 60px rgba(0,0,0,.18); overflow: hidden;
    animation: op-su .25s ease;
  }
  .co-hdr {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 22px 16px; border-bottom: 1px solid #f1f5f9;
  }
  .co-title { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#0f172a; }
  .co-sub { font-size:12px; color:#94a3b8; margin-top:3px; }
  .co-close {
    width:30px; height:30px; display:flex; align-items:center; justify-content:center;
    border-radius:7px; border:1px solid #e2e8f0; background:transparent; color:#64748b;
    font-size:17px; line-height:1; transition:all .15s; flex-shrink:0;
  }
  .co-close:hover { background:#f8fafc; color:#0f172a; border-color:#cbd5e1; }
  .co-body { padding:20px 22px; display:flex; flex-direction:column; gap:14px; }
  .co-field { display:flex; flex-direction:column; gap:5px; }
  .co-label { font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.06em; }
  .co-input {
    width:100%; padding:9px 12px; border:1px solid #e2e8f0; border-radius:8px;
    font-size:13px; color:#0f172a; outline:none; background:#fff;
    transition:border-color .15s, box-shadow .15s;
  }
  .co-input:focus { border-color:#93c5fd; box-shadow:0 0 0 3px rgba(37,99,235,.08); }
  .co-input-wrap { position:relative; }
  .co-input-prefix {
    position:absolute; left:11px; top:50%; transform:translateY(-50%);
    color:#94a3b8; font-size:13px; pointer-events:none;
  }
  .co-input.has-prefix { padding-left:24px; }
  .co-select-wrap { position:relative; }
  .co-select-wrap select { appearance:none; }
  .co-select-arrow {
    position:absolute; right:11px; top:50%; transform:translateY(-50%);
    color:#94a3b8; font-size:11px; pointer-events:none;
  }
  .co-type-toggle { display:flex; gap:0; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
  .co-type-btn {
    flex:1; padding:9px 0; font-size:13px; font-weight:600; border:none;
    background:#f8fafc; color:#64748b; transition:all .15s;
  }
  .co-type-btn:hover { background:#f1f5f9; color:#0f172a; }
  .co-type-btn.active-buy  { background:#eff6ff; color:#2563eb; }
  .co-type-btn.active-sell { background:#fff1f2; color:#e11d48; }
  .co-row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .co-summary {
    background:#f8fafc; border:1px solid #f1f5f9; border-radius:10px;
    padding:14px 16px; display:flex; flex-direction:column; gap:8px;
  }
  .co-srow { display:flex; justify-content:space-between; align-items:center; }
  .co-skey { font-size:12px; color:#94a3b8; }
  .co-sval { font-size:12px; font-weight:600; color:#0f172a; }
  .co-sval.total { font-size:14px; color:#2563eb; }
  .co-divider { height:1px; background:#e2e8f0; margin:2px 0; }
  .co-footer {
    display:flex; gap:10px; padding:16px 22px 20px;
    border-top:1px solid #f1f5f9;
  }
  .co-cancel-btn {
    flex:1; padding:10px; border-radius:8px; border:1px solid #e2e8f0;
    background:#fff; color:#64748b; font-size:13px; font-weight:500;
    transition:all .15s;
  }
  .co-cancel-btn:hover { border-color:#cbd5e1; color:#0f172a; background:#f8fafc; }
  .co-submit-btn {
    flex:2; padding:10px; border-radius:8px; border:none;
    font-size:13px; font-weight:700; color:#fff; transition:all .15s;
  }
  .co-submit-btn.BUY  { background:#2563eb; }
  .co-submit-btn.BUY:hover  { background:#1d4ed8; }
  .co-submit-btn.SELL { background:#e11d48; }
  .co-submit-btn.SELL:hover { background:#be123c; }
  .co-submit-btn:disabled { opacity:.45; cursor:not-allowed; }
  .co-form-err { font-size:12px; color:#e11d48; padding:0 2px; }
`

function useStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('op-styles')) {
    const tag = document.createElement('style')
    tag.id = 'op-styles'
    tag.textContent = CSS
    document.head.appendChild(tag)
  }
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function TypeBadge({ type }) {
  return <span className={`op-badge ${type.toLowerCase()}`}><span className="op-dot" />{type}</span>
}
function StatusBadge({ status }) {
  return (
    <span className={`op-badge ${status.toLowerCase()}`}>
      <span className={`op-dot ${status === 'PENDING' ? 'bl' : ''}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`op-stat ${accent}`}>
      <div className="op-stat-label">{label}</div>
      <div className={`op-stat-value ${accent}`}>{value}</div>
      {sub && <div className="op-stat-sub">{sub}</div>}
    </div>
  )
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true); setError(null); setOrder(null)
    orderAPI.getOrder(orderId)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Failed to load order details.'))
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const color = order ? mc(order.market.symbol) : null
  const created = order ? fmtDate(order.createdAt) : null
  const updated = order ? fmtDate(order.updatedAt) : null

  return (
    <div className="op-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="op-modal">
        <div className="op-mhdr">
          <div className="op-mtitle">
            Order Details
            {order && <span className="op-mid">#{order.id}</span>}
          </div>
          <button className="op-mclose" onClick={onClose}>×</button>
        </div>

        <div className="op-mbody">
          {loading && (
            <div className="op-mload">
              <div className="op-spinner" />
              <span className="op-ltxt">Loading order details…</span>
            </div>
          )}
          {error && <div className="op-err">⚠ {error}</div>}
          {!loading && !error && order && (
            <>
              <div className="op-hero">
                <div className="op-hmarket">
                  <div className="op-hchip" style={{ background: color.bg, color: color.text, borderColor: color.border }}>
                    {order.market.symbol}
                  </div>
                  <div>
                    <div className="op-hsym">{order.market.symbol}</div>
                    <div className="op-hname">{order.market.name}</div>
                  </div>
                </div>
                <div className="op-hbadges">
                  <TypeBadge type={order.orderType} />
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <div className="op-dgrid">
                <div className="op-ditem">
                  <div className="op-dkey">Quantity</div>
                  <div className="op-dval">{order.quantity} <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 400 }}>shares</span></div>
                </div>
                <div className="op-ditem">
                  <div className="op-dkey">Price per Unit</div>
                  <div className="op-dval">{fmt(order.pricePerUnit)}</div>
                </div>
                <div className="op-ditem full">
                  <div className="op-dkey">Total Amount</div>
                  <div className={`op-dval big ${order.orderType === 'BUY' ? 'green' : 'red'}`}>
                    {fmt(order.totalAmount)}
                  </div>
                </div>
                <div className="op-ditem">
                  <div className="op-dkey">Order Type</div>
                  <div className={`op-dval ${order.orderType === 'BUY' ? 'blue' : 'red'}`}>{order.orderType}</div>
                </div>
                <div className="op-ditem">
                  <div className="op-dkey">Status</div>
                  <div className="op-dval">{order.status.charAt(0) + order.status.slice(1).toLowerCase()}</div>
                </div>
              </div>

              <div className="op-ddates">
                <div className="op-ddate">
                  <div className="op-ddkey">Created At</div>
                  <div className="op-ddval">{created.date}<br />{created.time}</div>
                </div>
                <div className="op-ddate">
                  <div className="op-ddkey">Last Updated</div>
                  <div className="op-ddval">{updated.date}<br />{updated.time}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Create Order Modal ───────────────────────────────────────────────────────
const DEFAULT_FORM = { orderType: 'BUY', marketId: '', quantity: '', pricePerUnit: '' }

function CreateOrderModal({ markets = [], user, onClose, onSuccess }) {
  const [form, setForm] = useState(() => {
    const first = markets[0]
    return {
      ...DEFAULT_FORM,
      marketId: first ? String(first.id) : '',
      pricePerUnit: first ? first.currentPrice.toFixed(2) : '',
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const selectedMarket = markets.find((m) => String(m.id) === String(form.marketId))
  const totalAmount = parseFloat(form.quantity || 0) * parseFloat(form.pricePerUnit || 0)

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const handleSubmit = async () => {
    if (!user) { setError('Please login to place an order'); return }
    setSubmitting(true); setError(null)
    try {
      const orderData = {
        user: { id: user.id },
        market: { id: form.marketId },
        quantity: parseFloat(form.quantity),
        pricePerUnit: parseFloat(form.pricePerUnit),
        orderType: form.orderType,
      }
      console.log(orderData)
      await orderAPI.createOrder(orderData)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = form.quantity && form.pricePerUnit && parseFloat(form.quantity) > 0 && !submitting

  return (
    <div className="co-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="co-modal">
        {/* Header */}
        <div className="co-hdr">
          <div>
            <div className="co-title">Create Order</div>
            <div className="co-sub">
              {selectedMarket
                ? `${selectedMarket.symbol} · $${selectedMarket.currentPrice.toFixed(2)}`
                : 'Place a new market order'}
            </div>
          </div>
          <button className="co-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="co-body">
          {error && <div className="op-err" style={{ marginBottom: 0 }}>⚠ {error}</div>}

          {/* Buy / Sell toggle */}
          <div className="co-field">
            <div className="co-label">Order Type</div>
            <div className="co-type-toggle">
              <button
                className={`co-type-btn ${form.orderType === 'BUY' ? 'active-buy' : ''}`}
                onClick={() => setForm((f) => ({ ...f, orderType: 'BUY' }))}
              >↑ Buy</button>
              <button
                className={`co-type-btn ${form.orderType === 'SELL' ? 'active-sell' : ''}`}
                onClick={() => setForm((f) => ({ ...f, orderType: 'SELL' }))}
              >↓ Sell</button>
            </div>
          </div>

          {/* Market selector */}
          <div className="co-field">
            <label className="co-label">Market</label>
            <div className="co-select-wrap">
              <select
                className="co-input"
                value={form.marketId}
                onChange={(e) => {
                  const m = markets.find((x) => String(x.id) === e.target.value)
                  setForm((f) => ({
                    ...f,
                    marketId: e.target.value,
                    pricePerUnit: m ? m.currentPrice.toFixed(2) : f.pricePerUnit,
                  }))
                }}
              >
                {markets.length === 0 && <option value="">No markets available</option>}
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>{m.symbol} — ${m.currentPrice.toFixed(2)}</option>
                ))}
              </select>
              <span className="co-select-arrow">▾</span>
            </div>
          </div>

          {/* Quantity + Price row */}
          <div className="co-row2">
            <div className="co-field">
              <label className="co-label">Quantity</label>
              <input
                className="co-input"
                type="number"
                min="1"
                placeholder="0"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <div className="co-field">
              <label className="co-label">Price / Unit</label>
              <div className="co-input-wrap">
                <span className="co-input-prefix">$</span>
                <input
                  className="co-input has-prefix"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.pricePerUnit}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="co-summary">
            <div className="co-srow">
              <span className="co-skey">Market</span>
              <span className="co-sval">{selectedMarket?.symbol ?? '—'}</span>
            </div>
            <div className="co-srow">
              <span className="co-skey">Quantity</span>
              <span className="co-sval">{form.quantity || '—'}</span>
            </div>
            <div className="co-srow">
              <span className="co-skey">Price / Unit</span>
              <span className="co-sval">{form.pricePerUnit ? `$${parseFloat(form.pricePerUnit).toFixed(2)}` : '—'}</span>
            </div>
            <div className="co-divider" />
            <div className="co-srow">
              <span className="co-skey">Estimated Total</span>
              <span className="co-sval total">{totalAmount > 0 ? `$${totalAmount.toFixed(2)}` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="co-footer">
          <button className="co-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={`co-submit-btn ${form.orderType}`}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {submitting
              ? 'Placing…'
              : form.orderType === 'BUY'
                ? '↑ Place Buy Order'
                : '↓ Place Sell Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
const COLS = [
  { key: 'id',     label: 'Order ID',     s: true },
  { key: 'market', label: 'Market',       s: true },
  { key: 'type',   label: 'Type',         s: true },
  { key: 'qty',    label: 'Quantity',     s: true },
  { key: 'price',  label: 'Price / Unit', s: true },
  { key: 'total',  label: 'Total',        s: true },
  { key: 'status', label: 'Status',       s: true },
  { key: 'date',   label: 'Date',         s: true },
]

function OrdersTable({ orders, sortKey, sortDir, onSort, onRowClick }) {
  if (orders.length === 0) {
    return (
      <div className="op-empty">
        <div className="op-empty-icon">📭</div>
        <div className="op-empty-text">No orders match your filters</div>
      </div>
    )
  }
  return (
    <table className="op-table">
      <thead className="op-thead">
        <tr>
          {COLS.map((col) => (
            <th
              key={col.key}
              className={`op-th ${col.s ? 's' : ''} ${col.key === sortKey ? 'sa' : ''}`}
              onClick={() => col.s && onSort(col.key)}
            >
              {col.label}
              {col.s && col.key === sortKey && (
                <span className="op-sarrow">{sortDir === 1 ? '↑' : '↓'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="op-tbody">
        {orders.map((order, i) => {
          const { date, time } = fmtDate(order.createdAt)
          const color = mc(order.market.symbol)
          return (
            <tr key={order.id} style={{ animationDelay: `${i * 0.03}s` }} onClick={() => onRowClick(order.id)} title="Click for details">
              <td className="op-oid">#{order.id}</td>
              <td>
                <div className="op-mcell">
                  <span className="op-mchip" style={{ background: color.bg, color: color.text, borderColor: color.border }}>
                    {order.market.symbol}
                  </span>
                  <div>
                    <div className="op-msym">{order.market.symbol}</div>
                    <div className="op-mname">{order.market.name}</div>
                  </div>
                </div>
              </td>
              <td><TypeBadge type={order.orderType} /></td>
              <td><span className="op-qty">{order.quantity}</span><span className="op-unit">shares</span></td>
              <td className="op-price">{fmt(order.pricePerUnit)}</td>
              <td className={`op-tot ${order.orderType.toLowerCase()}`}>{fmt(order.totalAmount)}</td>
              <td><StatusBadge status={order.status} /></td>
              <td>
                <div className="op-date">{date}</div>
                <div className="op-time">{time}</div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const from = total === 0 ? 0 : (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  return (
    <div className="op-pager">
      <span>{total === 0 ? 'No orders found' : `Showing ${from}–${to} of ${total} orders`}</span>
      <div className="op-pbtns">
        <button className="op-pb" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} className={`op-pb ${p === page ? 'active' : ''}`} onClick={() => onChange(p)}>{p}</button>
        ))}
        <button className="op-pb" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>›</button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PER_PAGE = 8

export default function OrdersPage() {
  useStyles()

  const { user } = useAppContext()

  const [orders, setOrders]       = useState([])
  const [markets, setMarkets]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [typeFilter, setType]     = useState('ALL')
  const [statusFilter, setStatus] = useState('ALL')
  const [search, setSearch]       = useState('')
  const [sortKey, setSortKey]     = useState('date')
  const [sortDir, setSortDir]     = useState(-1)
  const [page, setPage]           = useState(1)
  const [modalId, setModalId]     = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  const fetchOrders = useCallback(() => {
    if (!user?.id) return 
    setLoading(true); setError(null)
    orderAPI.getOrdersByUser(user.id)
      .then((res) => setOrders(res.data || []))
      .catch(() => setError('Failed to load orders. Please try again.'))
      .finally(() => setLoading(false))
  }, [user?.id])

  // Fetch orders on mount
  useEffect(() => { fetchOrders() }, [fetchOrders])

    const fetchMarkets = async () => {
        try {
        // setLoading(true);
        const response = await marketAPI.getMarkets();
        setMarkets(response.data);
        } catch (err) {
        setError(err.message);
        }
        // } finally {
        // // setLoading(false);
        // }
    };
 
   useEffect(() => { fetchMarkets(); }, [fetchMarkets]);

  const handleSort = useCallback((key) => {
    if (key === sortKey) setSortDir((d) => d * -1)
    else { setSortKey(key); setSortDir(-1) }
    setPage(1)
  }, [sortKey])

  const stats = useMemo(() => {
    const buys  = orders.filter((o) => o.orderType === 'BUY')
    const sells = orders.filter((o) => o.orderType === 'SELL')
    return {
      total:     orders.length,
      buys:      buys.length,
      sells:     sells.length,
      pending:   orders.filter((o) => o.status === 'PENDING').length,
      buyTotal:  buys.reduce((s, o) => s + o.totalAmount, 0),
      sellTotal: sells.reduce((s, o) => s + o.totalAmount, 0),
    }
  }, [orders])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return [...orders]
      .filter((o) => {
        const typeOk   = typeFilter === 'ALL' || o.orderType === typeFilter
        const statusOk = statusFilter === 'ALL' || o.status === statusFilter
        const searchOk = !q || o.market.symbol.toLowerCase().includes(q)
          || o.market.name.toLowerCase().includes(q) || String(o.id).includes(q)
        return typeOk && statusOk && searchOk
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'id':     return sortDir * (a.id - b.id)
          case 'market': return sortDir * a.market.symbol.localeCompare(b.market.symbol)
          case 'type':   return sortDir * a.orderType.localeCompare(b.orderType)
          case 'qty':    return sortDir * (a.quantity - b.quantity)
          case 'price':  return sortDir * (a.pricePerUnit - b.pricePerUnit)
          case 'total':  return sortDir * (a.totalAmount - b.totalAmount)
          case 'status': return sortDir * a.status.localeCompare(b.status)
          case 'date':   return sortDir * (new Date(a.createdAt) - new Date(b.createdAt))
          default:       return 0
        }
      })
  }, [orders, typeFilter, statusFilter, search, sortKey, sortDir])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const reset = (fn) => (v) => { fn(v); setPage(1) }

  const typeCls = (t) => {
    if (typeFilter !== t) return 'op-fb'
    return `op-fb ${t === 'BUY' ? 'a-buy' : t === 'SELL' ? 'a-sell' : 'a-all'}`
  }

  return (
    <div className="op-page">
      {/* Heading */}
      <div className="op-heading">
        <div className="op-heading-left">
          <h1 className="op-title">My <span className="op-title-accent">Orders</span></h1>
          <p className="op-subtitle">Click any row to view order details</p>
        </div>
        <button className="op-create-btn" onClick={() => setShowCreate(true)}>
          <span className="op-create-btn-icon">＋</span> New Order
        </button>
      </div>

      {error && <div className="op-err">⚠ {error}</div>}

      {/* Stats */}
      <div className="op-stats">
        <StatCard label="Total Orders" value={stats.total}   sub="All time"                           accent="blue"  />
        <StatCard label="Buy Orders"   value={stats.buys}    sub={`${fmt(stats.buyTotal)} invested`}  accent="green" />
        <StatCard label="Sell Orders"  value={stats.sells}   sub={`${fmt(stats.sellTotal)} realized`} accent="red"   />
        <StatCard label="Pending"      value={stats.pending} sub="Awaiting execution"                 accent="amber" />
      </div>

      {/* Filters */}
      <div className="op-filters">
        <div className="op-fg">
          {['ALL', 'BUY', 'SELL'].map((t) => (
            <button key={t} className={typeCls(t)} onClick={() => reset(setType)(t)}>
              {t === 'ALL' ? 'All Types' : t}
            </button>
          ))}
        </div>
        <div className="op-fg">
          {['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              className={`op-fb${statusFilter === s ? ' a-all' : ''}`}
              onClick={() => reset(setStatus)(s)}
            >
              {s === 'ALL' ? 'Any Status' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="op-search">
          <span className="op-si">⌕</span>
          <input
            className="op-si-input"
            type="text"
            placeholder="Search by market or order ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="op-card">
        {loading ? (
          <div className="op-loading">
            <div className="op-spinner" />
            <span className="op-ltxt">Loading your orders…</span>
          </div>
        ) : (
          <>
            <OrdersTable
              orders={paginated}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onRowClick={setModalId}
            />
            <Pagination total={filtered.length} page={page} perPage={PER_PAGE} onChange={setPage} />
          </>
        )}
      </div>

      {/* Detail modal */}
      {modalId !== null && (
        <OrderModal orderId={modalId} onClose={() => setModalId(null)} />
      )}

      {/* Create Order modal */}
      {showCreate && (
        <CreateOrderModal
          markets={markets}
          user={user}
          onClose={() => setShowCreate(false)}
          onSuccess={fetchOrders}   // re-fetches the list after a successful order
        />
      )}
    </div>
  )
}