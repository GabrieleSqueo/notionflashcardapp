import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import Navbar from './components/Navbar'
import MainContent from './components/MainContent'
import DashboardFooter from './components/DashboardFooter'

export default async function HomePage() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/latest/login')
    }

    // Check if the user has a Notion key
    const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('notion_key, username')
        .eq('user_id', data.user.id)
        .single()

    if (userError) {
        console.error('Error fetching user data:', userError)
    }

    const isNotionConnected = !!userData?.notion_key
    const username = userData?.username || 'User'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
            {data && data.user && (
                <Navbar username={username} />
            )}
            <MainContent isNotionConnected={isNotionConnected} />
        </div>
    )
}