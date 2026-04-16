'use client';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ChatWindow from '../../components/ChatWindow/ChatWindow';

export default function ChatPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) router.replace('/login');
  }, [currentUser, loading]);

  if (loading || !currentUser) return null;

  return <ChatWindow />;
}
