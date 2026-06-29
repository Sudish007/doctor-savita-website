/**
 * ChatWidget Component
 * Floating AI symptom chatbot with Vercel AI SDK streaming.
 * Positioned bottom-left to avoid overlapping with the WhatsApp button (bottom-right).
 * Uses useChat hook for streaming character-by-character display.
 * Includes persistent disclaimer, quick replies, and "Book Appointment" suggestion.
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import QuickReplies from './QuickReplies';

const WELCOME_MESSAGE = "Hello! I'm Dr. Savita's AI assistant. I can help you understand your symptoms and find the right homeopathic treatment. How can I help you today?";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, append, status } = useChat({
    api: '/api/chatbot',
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const inputValue = input ?? '';

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickReply = (message: string) => {
    append({ role: 'user', content: message });
  };

  const handleBookAppointment = (service?: string) => {
    const params = new URLSearchParams();
    if (service) {
      params.set('reason', service);
    }
    window.location.href = `/appointment${params.toString() ? `?${params.toString()}` : ''}`;
  };

  // Detect if a service was identified in the last assistant message
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant');
  const identifiedService = lastAssistantMessage
    ? detectService(lastAssistantMessage.content)
    : null;

  return (
    <>
      {/* Floating Chat Icon - Bottom Left */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full 
          bg-[var(--primary)] text-[var(--primary-foreground)] 
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          transition-shadow duration-200 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Close chat' : 'Open symptom chatbot'}
      >
        {isOpen ? (
          <CloseIcon />
        ) : (
          <ChatIcon />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] sm:w-[400px] h-[500px] 
              rounded-2xl overflow-hidden
              backdrop-blur-xl bg-[var(--glass-bg-heavy)] 
              border border-[var(--glass-border)]
              shadow-[var(--glass-shadow)]
              flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-light)] bg-[var(--background-secondary)]/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="text-[var(--primary-foreground)] text-xs font-bold">AI</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    Dr. Savita&apos;s Assistant
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Homeopathic Guidance</p>
                </div>
              </div>
            </div>

            {/* Persistent Disclaimer */}
            <div className="px-4 py-2 bg-[var(--accent-light)]/50 border-b border-[var(--border-light)]">
              <p className="text-[10px] text-[var(--foreground-muted)] leading-tight">
                ⚠️ This is not medical advice. Please book an appointment for proper diagnosis.
              </p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
              {/* Welcome Message */}
              <ChatMessage role="assistant" content={WELCOME_MESSAGE} />

              {/* Quick Replies (shown when no user messages yet) */}
              {messages.length === 0 && (
                <QuickReplies onSelect={handleQuickReply} />
              )}

              {/* Conversation Messages */}
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role as 'user' | 'assistant'}
                  content={message.content}
                  isStreaming={isLoading && message.id === messages[messages.length - 1]?.id && message.role === 'assistant'}
                />
              ))}

              {/* Streaming indicator when waiting for response */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <ChatMessage role="assistant" content="" isStreaming />
              )}

              {/* Book Appointment Button (when service identified) */}
              {identifiedService && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-3"
                >
                  <button
                    onClick={() => handleBookAppointment(identifiedService)}
                    className="px-4 py-2 text-xs font-medium rounded-full 
                      bg-[var(--accent)] text-white
                      hover:bg-[var(--accent-hover)] transition-colors duration-200
                      cursor-pointer"
                  >
                    📅 Book Appointment for {identifiedService}
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-[var(--border-light)] bg-[var(--background-secondary)]/30"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your symptoms..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-full
                    bg-[var(--background-secondary)] border border-[var(--border)]
                    text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
                    transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="w-9 h-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]
                    flex items-center justify-center
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-[var(--primary-hover)] transition-colors duration-200
                    cursor-pointer"
                  aria-label="Send message"
                >
                  <SendIcon />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Detects if a service area was mentioned in the assistant's response.
 */
function detectService(content: string): string | null {
  const serviceKeywords: Record<string, string[]> = {
    'Skin Disorders': ['skin', 'eczema', 'psoriasis', 'acne', 'rash', 'dermatitis', 'fungal'],
    'Digestive Issues': ['digestive', 'stomach', 'acidity', 'bloating', 'ibs', 'constipation', 'liver'],
    'Respiratory Ailments': ['respiratory', 'asthma', 'allergy', 'allergies', 'sinusitis', 'cough', 'breathing'],
    "Women's Health": ['pcos', 'menstrual', 'hormonal', 'period', 'fertility', 'pregnancy'],
    'Child Health': ['child', 'pediatric', 'growth', 'immunity in children', 'kids'],
    'Mental Wellness': ['anxiety', 'depression', 'stress', 'insomnia', 'mental', 'sleep'],
    'Chronic Diseases': ['arthritis', 'diabetes', 'thyroid', 'chronic'],
  };

  const lowerContent = content.toLowerCase();

  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some((keyword) => lowerContent.includes(keyword))) {
      return service;
    }
  }

  return null;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}
