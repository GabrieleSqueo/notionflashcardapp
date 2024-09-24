'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import NotionConnect from './NotionConnect'

const MainContent = ({ isNotionConnected }) => {
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

    return (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
                
                {error && (
                    <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NotionConnect 
                        isConnected={isNotionConnected} 
                        onConnect={handleConnectNotion}
                        isLoading={isLoading}
                    />
                    <Link href="/latest/my-projects" className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            My Projects
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            View all projects
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/latest/settings" className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            Settings
                                        </dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            Manage your account
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default MainContent