import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '../utils/supabase/server'
import Navbar from './components/Navbar'
import MainContent from './components/MainContent'
import DashboardFooter from './components/DashboardFooter'

export default async function HomePage() {
    const supabase = createClient()

    const { data, error: supabaseError } = await supabase.auth.getUser()
    if (supabaseError || !data?.user) {
        redirect('/latest/login')
    }

    // Log the user data to see the parameters
    console.log("User Data:", data.user)

    // Check if the user has a Notion key
    const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('notion_key')
        .eq('user_id', data.user.id)
        .single()

    if (userError) {
        console.error('Error fetching user data:', userError)
    }

    const isNotionConnected = !!userData?.notion_key

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userEmail={data.user.email} />
            <MainContent isNotionConnected={isNotionConnected} />
            <DashboardFooter isNotionConnected={isNotionConnected} />
        </div>
    )
}