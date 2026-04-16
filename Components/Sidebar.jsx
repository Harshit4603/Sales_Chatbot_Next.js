'use client';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar({ open, onClose }) {
  const { conversations, activeConvId, setActiveConvId, startNewConversation, deleteConversation, clearAll } = useChat();
  const { currentUser, logout } = useAuth();

  const handleSelect = (id) => {
    setActiveConvId(id);
    onClose?.();
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const grouped = conversations.reduce((acc, conv) => {
    const label = formatDate(conv.createdAt);
    if (!acc[label]) acc[label] = [];
    acc[label].push(conv);
    return acc;
  }, {});

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>◆</span>
            <span className={styles.brandName}>SalesBot</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <button className={styles.newChatBtn} onClick={() => { startNewConversation(); onClose?.(); }}>
          <span>＋</span> New Chat
        </button>

        <div className={styles.historyList}>
          {Object.keys(grouped).length === 0 && (
            <p className={styles.empty}>No conversations yet</p>
          )}
          {Object.entries(grouped).map(([label, convs]) => (
            <div key={label}>
              <p className={styles.groupLabel}>{label}</p>
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  className={`${styles.convItem} ${conv.id === activeConvId ? styles.active : ''}`}
                >
                  <button className={styles.convTitle} onClick={() => handleSelect(conv.id)}>
                    <span className={styles.convIcon}>💬</span>
                    <span className={styles.convText}>{conv.title}</span>
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          {currentUser?.role === 'admin' && (
            <button className={styles.clearBtn} onClick={clearAll}>🧹 Clear All Chats</button>
          )}
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{currentUser?.name?.[0] || 'U'}</div>
            <div>
              <p className={styles.userName}>{currentUser?.name}</p>
              <p className={styles.userRole}>{currentUser?.role === 'admin' ? '🛡️ Admin' : '👤 Sales Rep'}</p>
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Logout">⏻</button>
          </div>
        </div>
      </aside>
    </>
  );
}
