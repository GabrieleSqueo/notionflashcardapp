import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'

export default async function HomePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/latest/login')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Home Page</h1>
        <p>Welcome, {data.user.email}</p>
        <div className="space-x-4">
            <Link href="/latest/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go to Login
            </Link>
        </div>
        </div>
    )
}