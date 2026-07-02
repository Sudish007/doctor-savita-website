'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

interface Material {
  id: string
  title: string
  description: string
  subject: string
  price: number
  file_url: string | null
  is_published: boolean
  created_at: string
}

const SUBJECTS = ['Materia Medica', 'Organon', 'Repertory', 'Clinical Practice', 'Exam Tips', 'General']

/**
 * Admin Study Materials page.
 * Upload and manage PDFs/notes for students.
 */
export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', subject: 'General', price: 0 })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => { fetchMaterials() }, [])

  async function fetchMaterials() {
    if (!sb) { setLoading(false); return }
    const { data } = await sb.from('study_materials').select('*').order('created_at', { ascending: false })
    if (data) setMaterials(data as Material[])
    setLoading(false)
  }

  async function handleSave() {
    if (!sb || !form.title.trim()) return
    setSaving(true)
    setMessage(null)

    let fileUrl: string | null = null

    // Upload file if selected
    if (file) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
      const { data: uploadData, error: uploadError } = await sb.storage
        .from('study-materials')
        .upload(fileName, file)

      if (uploadError) {
        setMessage(`Upload failed: ${uploadError.message}`)
        setSaving(false)
        return
      }

      // Get public URL
      const { data: urlData } = sb.storage.from('study-materials').getPublicUrl(fileName)
      fileUrl = urlData.publicUrl
    }

    try {
      if (editingId) {
        const updateData: Record<string, unknown> = {
          title: form.title, description: form.description,
          subject: form.subject, price: form.price,
        }
        if (fileUrl) updateData.file_url = fileUrl
        await sb.from('study_materials').update(updateData).eq('id', editingId)
        setMessage('Material updated!')
      } else {
        await sb.from('study_materials').insert({
          title: form.title, description: form.description,
          subject: form.subject, price: form.price,
          file_url: fileUrl, is_published: true,
        })
        setMessage('Material added!')
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ title: '', description: '', subject: 'General', price: 0 })
      setFile(null)
      fetchMaterials()
    } catch { setMessage('Failed to save') }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!sb || !confirm('Delete this material?')) return
    await sb.from('study_materials').delete().eq('id', id)
    setMaterials(prev => prev.filter(m => m.id !== id))
  }

  async function togglePublish(id: string, current: boolean) {
    if (!sb) return
    await sb.from('study_materials').update({ is_published: !current }).eq('id', id)
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, is_published: !current } : m))
  }

  function startEdit(m: Material) {
    setEditingId(m.id)
    setForm({ title: m.title, description: m.description || '', subject: m.subject, price: m.price })
    setShowForm(true)
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Study Materials</h2>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '', subject: 'General', price: 0 }); setFile(null) }}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Material'}
        </button>
      </div>

      {message && <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{message}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{editingId ? 'Edit Material' : 'Add New Material'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Price (₹0 = Free)</label>
              <input type="number" min="0" value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">PDF File</label>
              <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : editingId ? 'Update' : 'Add Material'}
          </button>
        </div>
      )}

      {/* Materials List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">All Materials ({materials.length})</h3>
        </div>
        {materials.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">No materials yet. Add your first one above.</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {materials.map(m => (
              <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{m.title}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${m.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {m.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">{m.subject}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.price > 0 ? `₹${m.price}` : 'FREE'} · {new Date(m.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1.5 ml-4">
                  <button onClick={() => startEdit(m)} className="px-2 py-1 text-[10px] rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Edit</button>
                  <button onClick={() => togglePublish(m.id, m.is_published)} className="px-2 py-1 text-[10px] rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200">{m.is_published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => handleDelete(m.id)} className="px-2 py-1 text-[10px] rounded bg-red-100 text-red-700 hover:bg-red-200">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
