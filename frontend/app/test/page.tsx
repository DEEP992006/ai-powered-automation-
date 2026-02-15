"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"

interface TestResult {
  success: boolean
  message: string
  timestamp: string
  testResults?: any
  error?: string
}

interface EmailData {
  id: string
  subject: string
  from: string
  date: string
  isUnread?: boolean
  snippet?: string
}

export default function TestPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testGmailOperations = async (accessToken: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🚀 Sending request to backend with token length:', accessToken.length)
      
      const response = await axios.post('http://localhost:3001/api/test-gmail', {
        accessToken: accessToken
      }, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('✅ Backend response received:', response.data)
      setResult(response.data)
    } catch (err: any) {
      console.error('❌ Backend request failed:', err)
      
      if (err.code === 'ECONNREFUSED') {
        setError('Backend server is not running. Please start the backend server on port 3001.')
      } else if (err.response) {
        setError(`Backend error: ${err.response.data?.error || err.response.statusText}`)
      } else if (err.request) {
        setError('No response from backend server. Check if it\'s running.')
      } else {
        setError(`Request failed: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      console.log('🎯 Session authenticated, starting Gmail operations test...')
      testGmailOperations(session.accessToken)
    } else if (status === 'unauthenticated') {
      setError('You need to be signed in to test Gmail operations')
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">You need to sign in to test Gmail operations.</p>
            <a
              href="/api/auth/signin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📧 Gmail Operations Test</h1>
              <p className="text-gray-600 mt-2">Testing backend Gmail API integration</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${session?.accessToken ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <p className="font-medium">
                {session?.accessToken ? '✅ Access Token Available' : '❌ No Access Token'}
              </p>
              <p className="text-sm text-gray-600">
                {session?.accessToken 
                  ? `Token length: ${session.accessToken.length} characters`
                  : 'Gmail access token not found in session'
                }
              </p>
            </div>
            {loading && (
              <div className="ml-auto flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-600 font-medium">Testing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="text-red-500 text-xl">❌</div>
              <div>
                <h3 className="font-medium text-red-800 mb-2">Error</h3>
                <p className="text-red-700">{error}</p>
                
                {error.includes('Backend server is not running') && (
                  <div className="mt-4 p-4 bg-gray-100 rounded border-l-4 border-blue-500">
                    <h4 className="font-medium text-gray-900 mb-2">To start the backend server:</h4>
                    <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
                      cd backend && npm start
                    </code>
                  </div>
                )}
                
                <button
                  onClick={() => session?.accessToken && testGmailOperations(session.accessToken)}
                  disabled={loading || !session?.accessToken}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  🔄 Retry Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="text-green-500 text-2xl">✅</div>
                <div>
                  <h3 className="font-bold text-green-800 text-lg mb-2">Test Completed Successfully!</h3>
                  <p className="text-green-700">{result.message}</p>
                  <p className="text-sm text-green-600 mt-1">Completed at: {new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {result.testResults && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Profile */}
                {result.testResults.userProfile && !result.testResults.userProfile.error && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      👤 User Profile
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {result.testResults.userProfile.emailAddress}</p>
                      <p><span className="font-medium">Total Messages:</span> {result.testResults.userProfile.messagesTotal?.toLocaleString()}</p>
                      <p><span className="font-medium">Total Threads:</span> {result.testResults.userProfile.threadsTotal?.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Labels */}
                {result.testResults.labels && !result.testResults.labels.error && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🏷️ Gmail Labels
                    </h3>
                    <p className="mb-3"><span className="font-medium">Total Labels:</span> {result.testResults.labels.count}</p>
                    <div className="space-y-1">
                      {result.testResults.labels.labels?.slice(0, 5).map((label: any, index: number) => (
                        <div key={index} className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-700">
                          {label.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Emails */}
                {result.testResults.recentEmails && !result.testResults.recentEmails.error && (
                  <div className="bg-white rounded-lg shadow-sm border p-6 lg:col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      📨 Recent Emails ({result.testResults.recentEmails.count})
                    </h3>
                    <div className="space-y-4">
                      {result.testResults.recentEmails.emails?.map((email: EmailData, index: number) => (
                        <div key={email.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-gray-900 truncate">{email.subject}</h4>
                                {email.isUnread && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">UNREAD</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">From: {email.from}</p>
                              <p className="text-sm text-gray-500">{email.date}</p>
                              {email.snippet && (
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{email.snippet}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unread Emails */}
                {result.testResults.unreadEmails && !result.testResults.unreadEmails.error && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🔵 Unread Emails ({result.testResults.unreadEmails.count})
                    </h3>
                    <div className="space-y-3">
                      {result.testResults.unreadEmails.emails?.slice(0, 5).map((email: EmailData, index: number) => (
                        <div key={email.id} className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                          <p className="font-medium text-gray-900 text-sm mb-1 truncate">{email.subject}</p>
                          <p className="text-xs text-gray-600">From: {email.from}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {result.testResults.aiSummary && !result.testResults.aiSummary.error && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      🤖 AI Summary ({result.testResults.aiSummary.count} emails)
                    </h3>
                    <div className="space-y-3">
                      {result.testResults.aiSummary.summary?.slice(0, 3).map((email: any, index: number) => (
                        <div key={email.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded border">
                          <p className="font-medium text-gray-900 text-sm mb-1">{email.subject}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>{email.isUnread ? '🔵 Unread' : '📖 Read'}</span>
                            <span>{email.hasAttachments ? '📎 Attachments' : '📄 No attachments'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON Response (Collapsible) */}
            <details className="bg-white rounded-lg shadow-sm border">
              <summary className="p-6 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                📋 Raw JSON Response (Click to expand)
              </summary>
              <div className="px-6 pb-6">
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Manual Test Button */}
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <button
            onClick={() => session?.accessToken && testGmailOperations(session.accessToken)}
            disabled={loading || !session?.accessToken}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? '🔄 Testing...' : '🧪 Run Test Again'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            This will send your access token to the backend for Gmail API testing
          </p>
        </div>
      </div>
    </div>
  )
}