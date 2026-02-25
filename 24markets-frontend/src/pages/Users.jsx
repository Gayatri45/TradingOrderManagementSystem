import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';

/* ─── Icons ─────────────────────────────────────────────────────────── */
const Icon = {
  Search: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
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
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
    --blue:     #3b82f6;
    --blue-l:   rgba(59,130,246,0.1);
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

  .users-wrap {
    font-family: var(--font);
    color: var(--t1);
    background: var(--bg);
    min-height: 100vh;
    padding: 28px;
  }

  /* ── Page header ── */
  .users-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
    animation: fadeIn 0.4s ease both;
  }
  .users-header-left {}
  .users-title {
    font-size: 22px; font-weight: 800; letter-spacing: -0.03em;
    color: var(--t1); margin-bottom: 3px;
  }
  .users-subtitle { font-size: 13px; color: var(--t2); }

  .users-header-right { display: flex; align-items: center; gap: 10px; }

  .users-refresh-btn {
    display: flex; align-items: center; gap: 6px;
    border: 1px solid var(--border); background: var(--surface);
    border-radius: var(--r-sm); padding: 7px 13px;
    font-size: 12px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer;
    transition: all 0.15s; box-shadow: var(--sh-sm);
  }
  .users-refresh-btn:hover { background: var(--bg); color: var(--t1); border-color: #d1d5db; }
  .users-refresh-btn.spinning svg { animation: spin 0.8s linear infinite; }

  /* ── Search bar ── */
  .users-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
    animation: fadeIn 0.4s 0.05s ease both;
  }
  .users-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 8px 14px;
    flex: 1; max-width: 280px;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: var(--sh-sm);
  }
  .users-search:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--ac-light);
  }
  .users-search-icon { color: var(--t3); flex-shrink: 0; }
  .users-search input {
    border: none; background: none; outline: none;
    font-size: 13px; color: var(--t1); font-family: var(--font); width: 100%;
  }
  .users-search input::placeholder { color: var(--t3); }

  .users-count {
    margin-left: auto;
    font-size: 12.5px; color: var(--t3); font-weight: 500;
  }
  .users-count strong { color: var(--t1); font-weight: 700; }

  /* ── Card ── */
  .users-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); box-shadow: var(--sh-sm);
    overflow: hidden;
    animation: fadeIn 0.4s 0.1s ease both;
  }

  /* ── Table ── */
  .users-table-scroll { overflow-x: auto; }
  .users-table { width: 100%; border-collapse: collapse; }

  .users-table thead tr { background: #fafafa; }
  .users-table th {
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase; color: var(--t3);
    padding: 12px 18px; text-align: left;
    border-bottom: 1px solid var(--border);
    white-space: nowrap; user-select: none; cursor: pointer;
  }
  .users-table th:first-child { padding-left: 24px; }
  .users-table th:last-child  { padding-right: 24px; text-align: center; }
  .users-table th:hover { color: var(--t1); }

  .users-table td {
    padding: 14px 18px; font-size: 13.5px; color: var(--t1);
    border-bottom: 1px solid var(--border-xs); vertical-align: middle;
  }
  .users-table td:first-child { padding-left: 24px; }
  .users-table td:last-child  { padding-right: 24px; text-align: center; }
  .users-table tbody tr:last-child td { border-bottom: none; }
  .users-table tbody tr { transition: background 0.12s; cursor: pointer; }
  .users-table tbody tr:hover { background: var(--sf-hover); }

  /* Name cell */
  .users-name-cell { display: flex; align-items: center; gap: 10px; }
  .users-avatar {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: var(--ac-light); display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: var(--accent);
    letter-spacing: -0.02em; font-family: var(--mono);
  }
  .users-name { font-size: 13.5px; font-weight: 700; color: var(--t1); letter-spacing: -0.01em; }
  .users-email  { font-size: 11px; color: var(--t3); font-weight: 500; margin-top: 1px; }

  /* Badge chips */
  .users-badge {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 6px;
  }
  .users-badge.active { background: var(--green-l); color: #059669; }
  .users-badge.inactive { background: var(--red-l); color: #dc2626; }
  .users-badge.admin { background: var(--blue-l); color: #1e40af; }
  .users-badge.user { background: #f3f4f6; color: var(--t3); }

  /* ── Empty state ── */
  .users-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 32px; gap: 12px; text-align: center;
  }
  .users-empty-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--t3); margin-bottom: 4px;
  }
  .users-empty-title { font-size: 15px; font-weight: 700; color: var(--t1); }
  .users-empty-desc  { font-size: 13px; color: var(--t2); max-width: 260px; line-height: 1.6; }

  /* No search results */
  .users-no-results {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 32px; gap: 8px; text-align: center;
  }
  .users-no-results-title { font-size: 14px; font-weight: 700; color: var(--t1); }
  .users-no-results-desc  { font-size: 13px; color: var(--t2); }
  .users-clear-btn {
    margin-top: 4px; border: 1px solid var(--border); background: none;
    border-radius: var(--r-sm); padding: 6px 14px;
    font-size: 12.5px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer; transition: all 0.15s;
  }
  .users-clear-btn:hover { background: var(--bg); color: var(--t1); }

  /* ── Error state ── */
  .users-error {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 72px 32px; gap: 12px; text-align: center;
  }
  .users-error-icon {
    width: 72px; height: 72px; border-radius: 20px;
    background: var(--red-l); border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--red); margin-bottom: 4px;
  }
  .users-error-title { font-size: 15px; font-weight: 700; color: var(--t1); }
  .users-error-desc  { font-size: 13px; color: var(--t2); max-width: 280px; line-height: 1.6; }
  .users-retry-btn {
    margin-top: 4px; background: var(--red); color: #fff;
    border: none; border-radius: var(--r-sm); padding: 8px 18px;
    font-size: 13px; font-weight: 700; font-family: var(--font);
    cursor: pointer; transition: all 0.15s;
    box-shadow: 0 2px 8px rgba(239,68,68,0.25);
  }
  .users-retry-btn:hover { background: #dc2626; transform: translateY(-1px); }

  /* ── Modal overlay ── */
  .users-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: overlayIn 0.2s ease both;
  }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }

  .users-modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    width: 100%; max-width: 500px;
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1) both;
    overflow: hidden;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* Modal header */
  .users-modal-hd {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px 18px;
    border-bottom: 1px solid var(--border);
  }
  .users-modal-title { font-size: 16px; font-weight: 800; color: var(--t1); letter-spacing: -0.02em; }
  .users-modal-close {
    width: 32px; height: 32px; border-radius: var(--r-sm);
    border: 1px solid var(--border); background: none;
    display: flex; align-items: center; justify-content: center;
    color: var(--t3); cursor: pointer; transition: all 0.15s; flex-shrink: 0;
  }
  .users-modal-close:hover { background: var(--bg); color: var(--t1); border-color: #d1d5db; }

  /* Modal body */
  .users-modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }
  .users-modal-row { display: flex; flex-direction: column; gap: 4px; }
  .users-modal-label { font-size: 12px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.04em; }
  .users-modal-value { font-size: 13.5px; font-weight: 600; color: var(--t1); }

  /* Pagination */
  .users-pagination {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 20px; padding: 16px;
  }
  .users-pagination-btn {
    border: 1px solid var(--border); background: var(--surface);
    border-radius: var(--r-sm); padding: 6px 10px;
    font-size: 12px; font-weight: 600; color: var(--t2);
    font-family: var(--font); cursor: pointer; transition: all 0.15s;
  }
  .users-pagination-btn:hover:not(:disabled) { background: var(--bg); color: var(--t1); }
  .users-pagination-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .users-pagination-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* Animations */
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin    { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .users-wrap { padding: 16px; }
    .users-header { flex-direction: column; align-items: flex-start; gap: 12px; }
    .users-header-right { width: 100%; }
    .users-toolbar { flex-wrap: wrap; }
    .users-search { max-width: 100%; flex: 1; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────────── */
const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getInitials = (fullName) => {
  if (!fullName) return '?';
  return fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/* ─── User Detail Modal ────────────────────────────────────────────── */
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;

  const formatCurrency = (amount) => `$${amount?.toFixed(2) || '0.00'}`;

  return (
    <div className="users-overlay" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="users-modal-hd">
          <h2 className="users-modal-title">{user.fullName}</h2>
          <button className="users-modal-close" onClick={onClose}>
            <Icon.X />
          </button>
        </div>

        {/* Body: Table Layout */}
        <div className="users-modal-body">
          <table className="users-modal-table">
            <tbody>              
              <tr>
                <td className="users-modal-label">Full Name</td>
                <td className="users-modal-value">{user.fullName}</td>
              </tr>
              <tr>
                <td className="users-modal-label">Email</td>
                <td className="users-modal-value">{user.email}</td>
              </tr>
              <tr>
                <td className="users-modal-label">Wallet Balance</td>
                <td className="users-modal-value">{formatCurrency(user.walletBalance)}</td>
              </tr>
              <tr>
                <td className="users-modal-label">Status</td>
                <td className="users-modal-value">
                  <span className={`users-badge ${user.status?.toLowerCase() || 'active'}`}>
                    {user.status || 'ACTIVE'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="users-modal-label">Role</td>
                <td className="users-modal-value">
                  <span className={`users-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                    {user.isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </td>
              </tr>
              {user.role && (
                <tr>
                  <td className="users-modal-label">User Role</td>
                  <td className="users-modal-value">{user.role}</td>
                </tr>
              )}
              <tr>
                <td className="users-modal-label">Join Date</td>
                <td className="users-modal-value">{formatDate(user.createdAt)}</td>
              </tr>
              <tr>
                <td className="users-modal-label">Last Updated</td>
                <td className="users-modal-value">{formatDate(user.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
/* ─── Main Component ──────────────────────────────────────────────── */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 10;

  /* Fetch users */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userAPI.getAllUsers();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* Filter and sort users */
  useEffect(() => {
    let result = [...users];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, search, sortBy, sortDir]);

  /* Pagination */
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  /* Sort handler */
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  /* Refresh */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="users-wrap">
        {/* Header */}
        <div className="users-header">
          <div className="users-header-left">
            <h1 className="users-title">Users Management</h1>
            <p className="users-subtitle">View and manage all system users</p>
          </div>
          <div className="users-header-right">
            <button
              className={`users-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              onClick={handleRefresh}
              disabled={loading}
            >
              <Icon.Refresh />
              Refresh
            </button>
          </div>
        </div>

        {/* Search & Count */}
        <div className="users-toolbar">
          <div className="users-search">
            <Icon.Search />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="users-count">
            Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredUsers.length}</strong>
          </div>
        </div>

        {/* Table Card */}
        <div className="users-card">
          {loading && !users.length ? (
            <div className="users-empty">
              <div className="users-empty-icon">
                <Icon.EmptyState />
              </div>
              <div className="users-empty-title">Loading users...</div>
              <div className="users-empty-desc">Please wait while we fetch your data</div>
            </div>
          ) : error ? (
            <div className="users-error">
              <div className="users-error-icon">
                <Icon.Alert />
              </div>
              <div className="users-error-title">Error loading users</div>
              <div className="users-error-desc">{error}</div>
              <button className="users-retry-btn" onClick={handleRefresh}>
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-no-results">
              <div className="users-empty-icon">
                <Icon.EmptyState />
              </div>
              <div className="users-no-results-title">No users found</div>
              <div className="users-no-results-desc">
                {search ? 'Try adjusting your search filters' : 'No users in the system'}
              </div>
              {search && (
                <button className="users-clear-btn" onClick={() => setSearch('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="users-table-scroll">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('fullName')}>Name</th>
                      <th onClick={() => handleSort('email')}>Email</th>
                      <th onClick={() => handleSort('walletBalance')}>Wallet Balance</th>
                      <th onClick={() => handleSort('status')}>Status</th>
                      <th onClick={() => handleSort('isAdmin')}>Role</th>
                      <th onClick={() => handleSort('createdAt')}>Join Date</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} onClick={() => setSelectedUser(user)}>
                        <td>
                          <div className="users-name-cell">
                            <div className="users-avatar">{getInitials(user.fullName)}</div>
                            <div>
                              <div className="users-name">{user.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>${user.walletBalance?.toFixed(2) || '0.00'}</td>
                        <td>
                          <span className={`users-badge ${user.status?.toLowerCase() || 'active'}`}>
                            {user.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td>
                          <span className={`users-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button
                            style={{
                              background: 'var(--accent)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 'var(--r-sm)',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="users-pagination">
                  <button
                    className="users-pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`users-pagination-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="users-pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </>
  );
}
