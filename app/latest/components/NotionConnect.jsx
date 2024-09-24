'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const NotionConnect = ({ isConnected }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConnectNotion = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Call our own API route to initiate Notion OAuth flow
      const response = await fetch("/api/initiate-notion-oauth");
      if (!response.ok) {
        throw new Error('Failed to initiate Notion OAuth');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Redirect to Notion authorization page
      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error('Error connecting to Notion:', err)
      setError('Failed to connect to Notion. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Notion Workspace
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {isConnected ? 'Connected' : 'Not Connected'}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        {error && (
          <div className="mb-2 text-red-600 text-sm">{error}</div>
        )}
        {isConnected ? (
          <div className="text-sm">
            <Link href="/latest/notion-settings" className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Notion settings
            </Link>
          </div>
        ) : (
          <div className="text-sm">
            <button
              onClick={handleConnectNotion}
              disabled={isLoading}
              className="font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
            >
              {isLoading ? 'Connecting...' : 'Connect Notion workspace'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotionConnect