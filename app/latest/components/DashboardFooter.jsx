'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MdAdd, MdLink } from 'react-icons/md'

const DashboardFooter = ({ isNotionConnected }) => {
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
        <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-100 to-purple-100 shadow-md p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-2 text-red-600 text-sm text-center">{error}</div>
                )}
                {isNotionConnected ? (
                    <Link href="/latest/new-project" className="block">
                        <button 
                            onClick={(e) => handleButtonClick(e, () => {})}
                            className="w-full flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-xl shadow-[0_5px_0_rgb(18,142,63)] text-xl font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(18,142,63)] active:translate-y-[5px]"
                        >
                            <MdAdd className="w-6 h-6 mr-2" />
                            Create New Flashcard Project
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={(e) => handleButtonClick(e, handleConnectNotion)}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-6 py-3 bg-indigo-500 text-white rounded-xl shadow-[0_5px_0_rgb(67,56,202)] text-xl font-bold transition-all duration-150 active:shadow-[0_0_0_rgb(67,56,202)] active:translate-y-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdLink className="w-6 h-6 mr-2" />
                        {isLoading ? 'Connecting...' : 'Connect Notion to Create Flashcards'}
                    </button>
                )}
            </div>
        </footer>
    )
}

export default DashboardFooter