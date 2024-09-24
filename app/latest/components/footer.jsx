import React from 'react'
import Link from 'next/link'

const Footer = ({ isNotionConnected }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {isNotionConnected ? (
                    <Link href="/latest/new-project" className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Flashcard Project
                    </Link>
                ) : (
                    <Link href="/latest/connect-notion" className="flex items-center justify-center w-full px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Connect Notion to Create Flashcards
                    </Link>
                )}
            </div>
        </footer>
    )
}

export default Footer