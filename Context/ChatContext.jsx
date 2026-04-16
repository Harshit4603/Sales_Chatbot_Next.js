'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

const generateId = () => Math.random().toString(36).slice(2, 9);

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);

  // Load from localStorage per user
  useEffect(() => {
    if (!currentUser) return;
    const key = `sb_chats_${currentUser.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) setActiveConvId(parsed[0].id);
    } else {
      startNewConversation();
    }
  }, [currentUser]);

  // Save on change
  useEffect(() => {
    if (!currentUser || conversations.length === 0) return;
    localStorage.setItem(`sb_chats_${currentUser.id}`, JSON.stringify(conversations));
  }, [conversations, currentUser]);

  const startNewConversation = useCallback(() => {
    const id = generateId();
    const newConv = {
      id,
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(id);
    return id;
  }, []);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || null;

  const addMessage = useCallback((convId, message) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = [...c.messages, message];
        const title =
          c.title === 'New Conversation' && msgs[0]
            ? msgs[0].content.slice(0, 40) + (msgs[0].content.length > 40 ? '…' : '')
            : c.title;
        return { ...c, messages: msgs, title };
      })
    );
  }, []);

  const deleteConversation = useCallback((convId) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== convId);
      if (activeConvId === convId) {
        setActiveConvId(next[0]?.id || null);
      }
      return next;
    });
  }, [activeConvId]);

  const clearAll = useCallback(() => {
    setConversations([]);
    setActiveConvId(null);
    if (currentUser) localStorage.removeItem(`sb_chats_${currentUser.id}`);
  }, [currentUser]);

  return (
    <ChatContext.Provider value={{
      conversations,
      activeConvId,
      activeConversation,
      setActiveConvId,
      startNewConversation,
      addMessage,
      deleteConversation,
      clearAll,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
