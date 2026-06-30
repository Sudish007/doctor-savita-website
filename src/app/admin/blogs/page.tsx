'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  emoji: string
  is_published: boolean
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Blog Management page.
 * Add, edit, delete blog posts. Stored in Supabase `blog_posts` table.
 */
export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'Education', emoji: '📝' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    if (!sb) { setLoading(false); return }
    try {
      const { data } = await sb.from('blog_posts').select('*').order('created_at', { ascending: false })
      if (data) setPosts(data as BlogPost[])
    } catch { /* ignore */ }
    setLoading(false)
  }

  async function handleSave() {
    if (!sb || !form.title.trim() || !form.content.trim()) return
    setSaving(true)
    setMessage(null)
    try {
      if (editingId) {
        await sb.from('blog_posts').update({
          title: form.title, excerpt: form.excerpt, content: form.content,
          category: form.category, emoji: form.emoji,
        }).eq('id', editingId)
        setMessage('Post updated!')
      } else {
        await sb.from('blog_posts').insert({
          title: form.title, excerpt: form.excerpt, content: form.content,
          category: form.category, emoji: form.emoji, is_published: true,
        })
        setMessage('Post created!')
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ title: '', excerpt: '', content: '', category: 'Education', emoji: '📝' })
      fetchPosts()
    } catch { setMessage('Failed to save') }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!sb || !confirm('Delete this post?')) return
    await sb.from('blog_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id)
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, emoji: post.emoji })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading blog posts...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Blog Management</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', excerpt: '', content: '', category: 'Education', emoji: '📝' }) }}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {message && <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{message}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{editingId ? 'Edit Post' : 'New Post'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <input type="text" placeholder="Emoji (e.g. 🌿)" value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          <textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none" />
          <textarea placeholder="Full content (markdown supported)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      )}

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Posts ({posts.length})</h3>
        </div>
        {posts.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">No blog posts yet. Create your first post above.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {posts.map(post => (
              <div key={post.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{post.emoji} {post.title}</p>
                  <p className="text-xs text-gray-500">{post.category} · {new Date(post.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(post)} className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400">Note: Blog posts from the admin are stored in Supabase. Hardcoded posts on the /blog page will show alongside these.</p>
    </div>
  )
}
