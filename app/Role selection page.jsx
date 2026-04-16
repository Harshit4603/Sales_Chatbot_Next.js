'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.replace('/chat');
  }, [currentUser]);

  const handleLogin = (role) => {
    login(role);
    router.push('/chat');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>SalesBot</span>
        </div>
        <p className={styles.subtitle}>Your AI-powered sales assistant</p>

        <div className={styles.roleGrid}>
          <button className={styles.roleCard} onClick={() => handleLogin('user')}>
            <span className={styles.roleEmoji}>👤</span>
            <span className={styles.roleName}>Sales Rep</span>
            <span className={styles.roleDesc}>Chat, history, copy messages</span>
          </button>
          <button className={`${styles.roleCard} ${styles.adminCard}`} onClick={() => handleLogin('admin')}>
            <span className={styles.roleEmoji}>🛡️</span>
            <span className={styles.roleName}>Admin</span>
            <span className={styles.roleDesc}>Full access + manage all chats</span>
          </button>
        </div>

        <p className={styles.hint}>Select your role to continue</p>
      </div>
    </div>
  );
}
