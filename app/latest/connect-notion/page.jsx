'use client'

import React, { useState } from 'react'
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation'

const ConnectNotion = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    const handleConnectNotion = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Call our own API route to initiate Notion OAuth flow
            const response = await fetch("/api/initiate-notion-oauth");
            const data = await response.json();
            console.log(data)
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
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Connect to Notion
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Link your Notion account to start creating flashcards
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}
                    <button
                        onClick={handleConnectNotion}
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isLoading ? 'Connecting...' : 'Connect Notion'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConnectNotion
