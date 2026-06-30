'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

interface AdminUser {
  id: string
  username: string
  role: 'admin' | 'staff' | 'viewer'
  created_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const sb = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

/**
 * Admin Users Management page.
 * Add/remove admin users with role-based access.
 * Roles: admin (full access), staff (queue + appointments), viewer (read-only)
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'staff' | 'viewer'>('staff')
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    if (!sb) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await sb
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true })

      if (!error && data) {
        setUsers(data as AdminUser[])
      }
    } catch {
      // Table might not exist yet
    } finally {
      setLoading(false)
    }
  }

  async function handleAddUser() {
    if (!sb || !newUsername.trim() || !newPassword.trim()) return
    setSaving(true)
    setMessage(null)

    try {
      // Check if username already exists
      const { data: existing } = await sb
        .from('admin_users')
        .select('id')
        .eq('username', newUsername.trim().toLowerCase())
        .single()

      if (existing) {
        setMessage('Username already exists')
        setSaving(false)
        return
      }

      const { error } = await sb
        .from('admin_users')
        .insert({
          username: newUsername.trim().toLowerCase(),
          password: newPassword.trim(), // In production, hash this
          role: newRole,
        })

      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage(`User "${newUsername}" added successfully!`)
        setNewUsername('')
        setNewPassword('')
        setNewRole('staff')
        setShowAddForm(false)
        fetchUsers()
      }
    } catch {
      setMessage('Failed to add user')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteUser(id: string, username: string) {
    if (!sb) return
    if (!confirm(`Delete user "${username}"?`)) return

    try {
      await sb.from('admin_users').delete().eq('id', id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setMessage(`User "${username}" deleted`)
    } catch {
      setMessage('Failed to delete user')
    }
  }

  async function handleRoleChange(id: string, role: 'admin' | 'staff' | 'viewer') {
    if (!sb) return
    try {
      await sb.from('admin_users').update({ role }).eq('id', id)
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u))
    } catch {
      setMessage('Failed to update role')
    }
  }

  const roleColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    staff: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    viewer: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          User Management
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add User'}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'admin' | 'staff' | 'viewer')}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="admin">Admin (full access)</option>
              <option value="staff">Staff (queue + appointments)</option>
              <option value="viewer">Viewer (read only)</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            disabled={saving || !newUsername.trim() || !newPassword.trim()}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Adding...' : 'Add User'}
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Admin Users ({users.length})
          </h3>
        </div>

        {/* Default admin note - only visible to admin role */}
        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            ⚠️ Master password login is available for emergency access only.
          </p>
        </div>

        {users.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No additional users added yet. Default admin login still works.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Username</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Created</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user.username}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'staff' | 'viewer')}
                        className={`px-2 py-0.5 rounded text-xs font-medium border-0 ${roleColors[user.role]}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Role Permissions</h3>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p><span className="font-medium text-red-600">Admin:</span> Full access — appointments, contacts, queue, videos, timelines, users management</p>
          <p><span className="font-medium text-blue-600">Staff:</span> Manage queue, view appointments, view contacts</p>
          <p><span className="font-medium text-gray-600">Viewer:</span> Read-only access to all pages, no edit/delete actions</p>
        </div>
      </div>
    </div>
  )
}
