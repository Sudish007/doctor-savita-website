'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from "@/components/layout/Navigation"


interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: string
  date: string
  emoji: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Homeopathic Remedies for Monsoon Allergies',
    excerpt: 'Monsoon brings relief from heat but also triggers allergies. Learn which remedies can help you breathe easier.',
    content: `Monsoon season often brings a surge in allergic reactions — sneezing, runny nose, skin rashes, and respiratory issues. Here are 5 homeopathic remedies that can help:\n\n**1. Allium Cepa** — For watery eyes and burning nasal discharge that worsens in warm rooms. Think of how cutting onions affects you — this remedy treats similar symptoms.\n\n**2. Arsenic Album** — For sneezing with thin, watery discharge, restlessness, and symptoms that worsen after midnight. Excellent for allergic rhinitis.\n\n**3. Natrum Mur** — For allergies with clear egg-white-like nasal discharge, sneezing in the morning, and loss of smell/taste.\n\n**4. Sabadilla** — For violent sneezing fits with itching in the nose and throat. Symptoms often triggered by flower pollen or cold air.\n\n**5. Histaminum** — A homeopathic antihistamine. Useful as a general anti-allergic remedy without drowsiness.\n\n**Important:** Potency and dosage should be determined by a qualified homeopath based on your individual constitution. Self-medication may not give optimal results.\n\n*Consult Dr. Savita for personalized allergy treatment.*`,
    category: 'Allergies',
    readTime: '4 min',
    date: '2026-06-28',
    emoji: '🌧️',
  },
  {
    id: '2',
    title: 'Why Homeopathy Works: Understanding the Science',
    excerpt: 'Homeopathy is often misunderstood. Here\'s a clear explanation of how it works and why millions trust it.',
    content: `Homeopathy operates on the principle of "Similia Similibus Curentur" — like cures like. A substance that causes symptoms in a healthy person can cure similar symptoms in a sick person when given in micro-doses.\n\n**How it works:**\n\n**1. Individualized Treatment** — Unlike conventional medicine which treats diseases, homeopathy treats the *person*. Two patients with the same disease may receive different remedies based on their unique symptoms, mental state, and constitution.\n\n**2. Minimum Dose** — Remedies are diluted and succussed (vigorously shaken) to enhance their healing properties while minimizing toxicity. This is called potentization.\n\n**3. Vital Force Stimulation** — Homeopathic remedies stimulate the body's own healing mechanisms rather than suppressing symptoms. This leads to lasting cure rather than temporary relief.\n\n**Evidence:**\n- Over 200 years of clinical use worldwide\n- Recognized by WHO as the 2nd largest therapeutic system\n- AYUSH Department, Govt. of India actively promotes homeopathy\n- Millions of satisfied patients across 80+ countries\n\n**What homeopathy is best for:**\n- Chronic diseases (skin, respiratory, digestive)\n- Allergies and autoimmune conditions\n- Mental health (anxiety, depression, insomnia)\n- Children's health (safe, gentle, no side effects)\n- Women's health (PCOS, hormonal imbalance)\n\n*Book a consultation with Dr. Savita to experience the difference.*`,
    category: 'Education',
    readTime: '5 min',
    date: '2026-06-25',
    emoji: '🔬',
  },
  {
    id: '3',
    title: 'Natural Immunity Boosters: A Homeopathic Approach',
    excerpt: 'Strengthen your immune system naturally without supplements. Simple remedies and lifestyle changes that work.',
    content: `A strong immune system is your best defense against infections. Homeopathy offers gentle yet effective ways to boost immunity naturally.\n\n**Top Immunity Boosters in Homeopathy:**\n\n**1. Echinacea** — Stimulates white blood cell production. Useful during seasonal changes when infections are common.\n\n**2. Thuja Occidentalis** — Strengthens immunity, especially after vaccination effects or recurring infections.\n\n**3. Calcarea Carb** — For people who catch cold easily, sweat profusely, and feel fatigued. Excellent for children.\n\n**4. Sulphur** — A deep-acting constitutional remedy that clears chronic toxins and boosts overall vitality.\n\n**Lifestyle Tips for Better Immunity:**\n- Sleep 7-8 hours consistently\n- Eat seasonal fruits and vegetables\n- Practice Pranayama (breathing exercises) daily\n- Reduce sugar intake — sugar suppresses immune cells for hours\n- Get 15 minutes of morning sunlight (Vitamin D)\n- Stay hydrated — 8 glasses of water minimum\n\n**For Children:**\nHomeopathic immunity boosters are especially safe for children. Unlike syrups that may contain sugar or artificial colors, homeopathic globules are natural, taste sweet, and have zero side effects.\n\n*Consult Dr. Savita for a personalized immunity-building plan.*`,
    category: 'Immunity',
    readTime: '4 min',
    date: '2026-06-20',
    emoji: '🛡️',
  },
  {
    id: '4',
    title: 'Managing PCOS Naturally with Homeopathy',
    excerpt: 'PCOS affects 1 in 5 Indian women. Learn how homeopathy addresses the root cause without hormonal pills.',
    content: `Polycystic Ovary Syndrome (PCOS) affects millions of women, causing irregular periods, weight gain, acne, and fertility issues. While conventional treatment relies on hormonal pills, homeopathy offers a gentler, root-cause approach.\n\n**How Homeopathy Treats PCOS:**\n\nInstead of suppressing symptoms with birth control pills, homeopathic remedies work by:\n- Regulating hormonal balance naturally\n- Improving ovarian function\n- Reducing insulin resistance\n- Managing associated symptoms (acne, hair growth, weight)\n\n**Common Remedies for PCOS:**\n\n**1. Pulsatilla** — For late, scanty, or suppressed periods with mood swings. Patient is usually mild, weepy, and feels better in open air.\n\n**2. Sepia** — For irregular periods with bearing-down sensation, irritability, and indifference. Excellent for hormonal imbalance.\n\n**3. Calcarea Carb** — For PCOS with weight gain, heavy periods, and cold sensitivity. Patient tends to be fair, flabby, and sweaty.\n\n**4. Apis Mellifica** — For ovarian cysts with stinging pain. Right-sided ovarian complaints.\n\n**5. Lachesis** — For left-sided ovarian issues with symptoms worse before menses and better once flow starts.\n\n**Diet Tips for PCOS:**\n- Reduce refined carbs and sugar\n- Include anti-inflammatory foods (turmeric, green vegetables)\n- Exercise 30 minutes daily\n- Manage stress through yoga/meditation\n\n**Treatment Duration:** Most patients see improvement in 3-6 months with consistent homeopathic treatment.\n\n*Dr. Savita specializes in women's health. Book a consultation for personalized PCOS management.*`,
    category: "Women's Health",
    readTime: '6 min',
    date: '2026-06-15',
    emoji: '🌸',
  },
  {
    id: '5',
    title: 'Homeopathy for Children: Safe, Gentle, Effective',
    excerpt: 'Why more parents are choosing homeopathy for their children — from teething to recurring infections.',
    content: `Children respond exceptionally well to homeopathic treatment. Their vital force is strong and reactive, making healing faster and more complete.\n\n**Why Homeopathy is Ideal for Children:**\n- No side effects — safe even for infants\n- Sweet-tasting globules — children love taking them\n- No drowsiness or dependency\n- Treats root cause, not just symptoms\n- Builds natural immunity rather than suppressing it\n\n**Common Childhood Issues Treated:**\n\n**1. Recurrent Colds & Coughs**\n- Remedies: Calc Carb, Tuberculinum, Silicea\n- Focus: Building immunity so infections stop recurring\n\n**2. Teething Troubles**\n- Remedies: Chamomilla, Calc Phos\n- Provides relief from pain, irritability, and diarrhea during teething\n\n**3. Tonsillitis**\n- Remedies: Baryta Carb, Hepar Sulph, Calc Carb\n- Can avoid surgery in many cases with constitutional treatment\n\n**4. Bedwetting**\n- Remedies: Equisetum, Causticum, Kreosotum\n- Addresses underlying cause rather than blaming the child\n\n**5. Behavioral Issues (ADHD tendencies)**\n- Remedies: Stramonium, Hyoscyamus, Tuberculinum\n- Gentle approach without sedating the child\n\n**Tips for Parents:**\n- Maintain a symptom diary — note what triggers issues\n- Be patient — homeopathy works with the body, not against it\n- Don't mix with self-prescribed supplements without consulting\n- Follow the prescribed potency and dosage exactly\n\n*Dr. Savita has extensive experience in pediatric homeopathy. Bring your child for a gentle, thorough consultation.*`,
    category: 'Child Care',
    readTime: '5 min',
    date: '2026-06-10',
    emoji: '👶',
  },
  {
    id: '6',
    title: 'Stress, Anxiety & Sleep: Homeopathic Solutions',
    excerpt: 'Modern life brings stress. Discover natural remedies for anxiety, panic attacks, and insomnia without dependency.',
    content: `Mental health is as important as physical health. Homeopathy treats the mind-body connection holistically, offering relief without the side effects of sleeping pills or anxiolytics.\n\n**Homeopathic Remedies for Mental Wellness:**\n\n**For Anxiety:**\n- **Aconite** — Sudden panic attacks with fear of death, palpitations\n- **Argentum Nitricum** — Anticipatory anxiety (before exams, interviews, events)\n- **Gelsemium** — Stage fright, trembling, weakness from anxiety\n- **Kali Phos** — Mental exhaustion from overwork, nervous breakdown\n\n**For Depression:**\n- **Ignatia** — Grief, loss, emotional shock, sighing\n- **Natrum Mur** — Suppressed emotions, dwelling on past hurts\n- **Aurum Met** — Deep depression with hopelessness\n\n**For Insomnia:**\n- **Coffea Cruda** — Mind too active, can't switch off thoughts\n- **Passiflora** — Restlessness and worry preventing sleep\n- **Nux Vomica** — Falls asleep but wakes at 3-4 AM, can't go back\n\n**Lifestyle Recommendations:**\n- Digital detox 1 hour before bed\n- 10 minutes of deep breathing (4-7-8 technique)\n- Morning sunlight exposure for 15 minutes\n- Regular exercise (even a 20-minute walk helps)\n- Journaling before bed to offload thoughts\n- Reduce caffeine after 2 PM\n\n**Important:** Homeopathic mental health treatment is complementary. For severe depression or suicidal thoughts, please also consult a psychiatrist.\n\n*Dr. Savita provides compassionate, judgment-free mental health support through homeopathy.*`,
    category: 'Mental Wellness',
    readTime: '5 min',
    date: '2026-06-05',
    emoji: '🧘',
  },
]

const CATEGORIES = ['All', 'Allergies', 'Education', 'Immunity', "Women's Health", 'Child Care', 'Mental Wellness']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const filtered = selectedCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === selectedCategory)

  return (
    <>
      <Navigation />
      <div className="pt-16 md:pt-20 pb-24 min-h-screen bg-background">
      <div className="container-content max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <a href="/" className="text-sm text-primary hover:underline mb-2 inline-block">← Back to website</a>
            <h1 className="text-3xl font-bold text-foreground mb-2">Health Blog</h1>
            <p className="text-foreground-muted">Expert homeopathic insights by Dr. Savita Kumari</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Posts */}
          <div className="space-y-4">
            {filtered.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{post.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent-light text-accent-foreground">
                          {post.category}
                        </span>
                        <span className="text-xs text-foreground-muted">{post.readTime} read</span>
                        <span className="text-xs text-foreground-muted">· {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <h2 className="text-lg font-semibold text-foreground mb-1.5 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Expanded Content */}
                      {expandedPost === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-border-light"
                        >
                          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground-secondary leading-relaxed whitespace-pre-line">
                            {post.content}
                          </div>
                        </motion.div>
                      )}

                      <button
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                      >
                        {expandedPost === post.id ? '← Show less' : 'Read more →'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10 p-6 glass-card rounded-2xl">
            <p className="text-foreground-muted mb-3">Have a health question? Get personalized advice.</p>
            <a href="/book" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
              📅 Book Consultation with Dr. Savita
            </a>
          </div>
      </div>
    </div>
    </>
  )
}