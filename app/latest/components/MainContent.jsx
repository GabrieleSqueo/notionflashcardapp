'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import NotionConnect from './NotionConnect'
import { MdSettings, MdFolderOpen, MdLightbulb, MdAddCircle, MdLock } from 'react-icons/md'
import DashboardFooter from './DashboardFooter'

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

    const ButtonLink = ({ href, icon: Icon, title, description, disabled }) => {
        const buttonContent = (
            <div className={`w-full text-left bg-white rounded-xl shadow-[0_5px_0_rgb(203,213,225)] overflow-hidden ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-[3px] transition-all duration-150'
            }`}>
                <div className="px-6 py-5">
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-xl p-3 ${disabled ? 'bg-gray-400' : 'bg-indigo-500'}`}>
                            {disabled ? <MdLock className="h-8 w-8 text-white" /> : <Icon className="h-8 w-8 text-white" />}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">
                                    {title}
                                </dt>
                                <dd className={`text-lg font-bold ${disabled ? 'text-gray-400' : 'text-indigo-600'}`}>
                                    {description}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        )

        return disabled ? (
            <div className="block">{buttonContent}</div>
        ) : (
            <Link href={href} className="block">{buttonContent}</Link>
        )
    }

    return (
        <main className="mx-auto py-6 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">                
                {error && (
                    <div className="mb-6 text-red-600 text-sm bg-red-100 border border-red-400 rounded-lg p-4">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <NotionConnect 
                        isConnected={isNotionConnected} 
                        onConnect={handleConnectNotion}
                        isLoading={isLoading}
                    />
                    <ButtonLink 
                        href="/latest/projects" 
                        icon={MdFolderOpen}
                        title="My Projects"
                        description="View all projects"
                        disabled={!isNotionConnected}
                    />
                    <ButtonLink 
                        href="/latest/new-project" 
                        icon={MdAddCircle}
                        title="New Project"
                        description="Create a new project"
                        disabled={!isNotionConnected}
                    />
                </div>
            </div>
            <DashboardFooter isNotionConnected={isNotionConnected}/>
        </main>
    )
}

export default MainContent
