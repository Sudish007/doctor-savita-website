/**
 * ChatMessage Component
 * Renders individual chat message bubbles with role-based styling.
 * User messages are right-aligned with primary color.
 * Assistant messages are left-aligned with glassmorphism.
 * Includes streaming indicator (animated dots) for assistant messages.
 * 
 * Requirements: 19.1, 19.7
 */

'use client';

import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-md'
            : 'backdrop-blur-md bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground)] rounded-bl-md shadow-sm'
        }`}
      >
        {content}
        {isStreaming && !content && <StreamingDots />}
      </div>
    </motion.div>
  );
}

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--foreground-muted)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </span>
  );
}
