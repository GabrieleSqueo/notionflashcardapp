'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MdLink, MdSettings } from 'react-icons/md'

const NotionConnect = ({ isConnected }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleConnectNotion = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/initiate-notion-oauth");
      if (!response.ok) {
        throw new Error('Failed to initiate Notion OAuth');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      window.location.href = data.authorizationUrl;
    } catch (err) {
      console.error('Error connecting to Notion:', err)
      setError('Failed to connect to Notion. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleButtonClick = (e, action) => {
    const button = e.currentTarget;
    button.classList.add('active');
    
    const removeActiveClass = () => {
        button.classList.remove('active');
    };

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            removeActiveClass();
            action(e);
        });
    });

    setTimeout(removeActiveClass, 150);
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl">
      <div className="px-6 py-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-purple-500 rounded-xl p-3">
            <MdLink className="h-8 w-8 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900">Notion Workspace</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Not Connected'}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        {isConnected ? (
          <Link href="/latest/notion-settings" className="block">
            <button
              onClick={(e) => handleButtonClick(e, () => {})}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-[0_3px_0_rgb(67,56,202)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[3px] hover:shadow-[0_2px_0_rgb(67,56,202)] hover:translate-y-[3px] overflow-hidden"
            >
              <MdSettings className="w-5 h-5 mr-2" />
              Manage Notion settings
            </button>
          </Link>
        ) : (
          <button
            onClick={(e) => handleButtonClick(e, handleConnectNotion)}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-xl shadow-[0_3px_0_rgb(126,34,206)] text-sm font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(126,34,206)] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdLink className="w-5 h-5 mr-2" />
            {isLoading ? 'Connecting...' : 'Connect Notion workspace'}
          </button>
        )}
      </div>
    </div>
  )
}

export default NotionConnect