'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import styles from './ChatWindow.module.css';

const generateId = () => Math.random().toString(36).slice(2, 9);

// Simulated AI response
const getBotResponse = async (userMessage) => {
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));
  const replies = [
    `Great question! Based on your query about "${userMessage.slice(0, 30)}...", I recommend focusing on the customer's pain points first.`,
    `That's a solid approach. For "${userMessage.slice(0, 30)}...", consider using SPIN selling techniques to qualify this lead.`,
    `Absolutely! When dealing with "${userMessage.slice(0, 30)}...", the key is to build rapport before pitching.`,
    `Here's a sales script you can use: Start with empathy, identify the gap, then present your solution clearly.`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

export default function ChatWindow() {
  const { currentUser } = useAuth();
  const { activeConversation, activeConvId, addMessage, startNewConversation } = useChat();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [focusedMsgIdx, setFocusedMsgIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  const messages = activeConversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let convId = activeConvId;
    if (!convId) convId = startNewConversation();

    const userMsg = { id: generateId(), role: 'user', content: input.trim(), ts: Date.now() };
    addMessage(convId, userMsg);
    setInput('');
    setLoading(true);

    try {
      const botReply = await getBotResponse(input);
      const botMsg = { id: generateId(), role: 'assistant', content: botReply, ts: Date.now() };
      addMessage(convId, botMsg);
    } catch (e) {
      const errMsg = { id: generateId(), role: 'assistant', content: 'Sorry, something went wrong. Please try again.', ts: Date.now() };
      addMessage(convId, errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = useCallback(async (msg) => {
    await navigator.clipboard.writeText(msg.content);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const goToPrev = () => {
    if (focusedMsgIdx === null) {
      setFocusedMsgIdx(messages.length - 1);
    } else {
      setFocusedMsgIdx(Math.max(0, focusedMsgIdx - 1));
    }
  };

  const goToNext = () => {
    if (focusedMsgIdx === null) return;
    if (focusedMsgIdx >= messages.length - 1) {
      setFocusedMsgIdx(null);
    } else {
      setFocusedMsgIdx(focusedMsgIdx + 1);
    }
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.layout}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} title="Open history">
            ☰
          </button>
          <div className={styles.headerTitle}>
            <span className={styles.headerIcon}>◆</span>
            <span>SalesBot</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          {messages.length > 0 && (
            <div className={styles.navControls}>
              <button className={styles.navBtn} onClick={goToPrev} title="Previous message">↑ Prev</button>
              <span className={styles.navIndicator}>
                {focusedMsgIdx !== null ? `${focusedMsgIdx + 1} / ${messages.length}` : `${messages.length} msg`}
              </span>
              <button className={styles.navBtn} onClick={goToNext} title="Next message">Next ↓</button>
            </div>
          )}
          <div className={styles.userBadge}>
            <span className={styles.userDot} data-admin={currentUser?.role === 'admin'} />
            <span>{currentUser?.role === 'admin' ? '🛡️ Admin' : currentUser?.name}</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>◆</div>
            <h2>Sales Assistant Ready</h2>
            <p>Ask me anything about your prospects, pitches, or pipeline.</p>
            <div className={styles.suggestions}>
              {['How do I handle price objections?', 'Write a cold email for SaaS product', 'How to close a deal faster?'].map((s) => (
                <button key={s} className={styles.suggestionBtn} onClick={() => setInput(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`${styles.messageRow} ${msg.role === 'user' ? styles.userRow : styles.botRow} ${focusedMsgIdx === idx ? styles.focused : ''}`}
              onClick={() => setFocusedMsgIdx(idx)}
            >
              {msg.role === 'assistant' && (
                <div className={styles.botAvatar}>◆</div>
              )}
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{msg.content}</p>
                <div className={styles.messageMeta}>
                  <span className={styles.msgTime}>{formatTime(msg.ts)}</span>
                  <button
                    className={`${styles.copyBtn} ${copiedId === msg.id ? styles.copied : ''}`}
                    onClick={(e) => { e.stopPropagation(); copyMessage(msg); }}
                    title="Copy message"
                  >
                    {copiedId === msg.id ? '✓ Copied' : '⎘ Copy'}
                  </button>
                </div>
              </div>
              {msg.role === 'user' && (
                <div className={styles.userAvatar}>{currentUser?.name?.[0] || 'U'}</div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className={`${styles.messageRow} ${styles.botRow}`}>
            <div className={styles.botAvatar}>◆</div>
            <div className={styles.messageBubble}>
              <div className={styles.typing}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Admin panel strip */}
      {currentUser?.role === 'admin' && (
        <div className={styles.adminStrip}>
          🛡️ Admin Mode — You can view and manage all conversations from the sidebar
        </div>
      )}

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.input}
            placeholder="Ask about sales strategies, objections, scripts..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            {loading ? '⋯' : '↑'}
          </button>
        </div>
        <p className={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
