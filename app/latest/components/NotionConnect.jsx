import React from 'react'
import Link from 'next/link'

const NotionConnect = ({ isConnected }) => {
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
        {isConnected ? (
          <div className="text-sm">
            <Link href="/latest/notion-settings" className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Notion settings
            </Link>
          </div>
        ) : (
          <div className="text-sm">
            <Link href="/latest/connect-notion" className="font-medium text-indigo-600 hover:text-indigo-500">
              Connect Notion workspace
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotionConnect