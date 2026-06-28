/**
 * QuickReplies Component
 * Displays quick-reply buttons for common symptom categories at the start of conversation.
 * On click, sends the category text as a user message to the chatbot.
 * 
 * Requirements: 19.4, 19.5
 */

'use client';

import { motion } from 'framer-motion';

interface QuickRepliesProps {
  onSelect: (message: string) => void;
}

const QUICK_REPLY_CATEGORIES = [
  { label: 'Skin Issues', message: 'I have skin problems like rashes or itching. What homeopathic treatments are available?' },
  { label: 'Digestive Problems', message: 'I am experiencing digestive issues like acidity or bloating. Can homeopathy help?' },
  { label: 'Stress & Anxiety', message: 'I am feeling stressed and anxious. What homeopathic remedies can help with mental wellness?' },
  { label: 'Allergies', message: 'I have allergies and respiratory problems. What homeopathic treatments do you offer?' },
  { label: "Women's Health", message: "I have concerns about women's health like hormonal imbalance or PCOS. Can you guide me?" },
  { label: 'Child Health', message: 'My child has health concerns. What homeopathic treatments are available for children?' },
];

export default function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="px-4 py-3">
      <p className="text-xs text-[var(--foreground-muted)] mb-2">
        Choose a category or type your question:
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_REPLY_CATEGORIES.map((category, index) => (
          <motion.button
            key={category.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            onClick={() => onSelect(category.message)}
            className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)] 
              bg-[var(--background-secondary)] text-[var(--foreground-secondary)]
              hover:bg-[var(--primary-light)] hover:border-[var(--primary)] hover:text-[var(--primary)]
              transition-colors duration-200 cursor-pointer"
          >
            {category.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
