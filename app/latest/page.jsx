import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import { logout } from './actions'

export default async function HomePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/latest/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Flashcard App</h1>
                <p className="text-center text-gray-600 mb-8">Welcome, {data.user.email}</p>
                
                <div className="space-y-4">
                    <Link href="/latest/new-project" className="flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Create New Flashcard Project
                    </Link>
                    
                    <Link href="/latest/my-projects" className="flex items-center justify-center w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        My Projects
                    </Link>
                    
                    <Link href="/latest/settings" className="flex items-center justify-center w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                    </Link>
                </div>
                
                <form action={logout} className="mt-8">
                    <button 
                        type="submit"
                        className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                    </button>
                </form>
            </div>
        </div>
    )
}