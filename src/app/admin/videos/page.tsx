'use client'

import { useEffect, useState } from 'react'

interface VideoConsultation {
  id: string
  patient_name: string
  phone_number: string
  description: string
  video_url: string
  status: 'pending' | 'replied' | 'archived'
  submitted_at: string
  reply_video_url?: string
  reply_at?: string
}

/**
 * Admin Video Consultations page.
 * Displays pending video questions with preview links and "Mark as Replied" actions.
 *
 * Requirements: 31.4, 31.5
 */
export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoConsultation[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      const res = await fetch('/api/admin/videos')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos ?? [])
      } else {
        setVideos(getMockVideos())
      }
    } catch {
      setVideos(getMockVideos())
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkReplied(id: string) {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'mark_replied' }),
      })
      if (res.ok) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === id ? { ...v, status: 'replied', reply_at: new Date().toISOString() } : v
          )
        )
      }
    } catch (err) {
      console.error('Failed to update video status:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingVideos = videos.filter((v) => v.status === 'pending')
  const repliedVideos = videos.filter((v) => v.status === 'replied')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading video consultations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Video Consultations
      </h2>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{pendingVideos.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
          <p className="text-xl font-bold text-green-700 dark:text-green-300">{repliedVideos.length}</p>
        </div>
      </div>

      {/* Pending Videos Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pending Questions ({pendingVideos.length})
          </h3>
        </div>

        {pendingVideos.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            No pending video consultations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Patient
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingVideos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                      {video.patient_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(video.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                        {video.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                      {video.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-xs font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          Preview
                        </a>
                        <button
                          onClick={() => handleMarkReplied(video.id)}
                          disabled={actionLoading === video.id}
                          className="px-3 py-1 text-xs font-medium rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Mark Replied
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/** Mock data fallback */
function getMockVideos(): VideoConsultation[] {
  return [
    {
      id: '1',
      patient_name: 'Meena Kumari',
      phone_number: '9876543210',
      description: 'Persistent headaches and dizziness for the past week',
      video_url: '#',
      status: 'pending',
      submitted_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      patient_name: 'Ravi Shankar',
      phone_number: '8765432109',
      description: 'Skin patches on arms, not responding to regular treatment',
      video_url: '#',
      status: 'pending',
      submitted_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      patient_name: 'Geeta Devi',
      phone_number: '7654321098',
      description: 'Child has recurring cold and cough',
      video_url: '#',
      status: 'replied',
      submitted_at: new Date(Date.now() - 432000000).toISOString(),
      reply_at: new Date(Date.now() - 345600000).toISOString(),
    },
  ]
}
