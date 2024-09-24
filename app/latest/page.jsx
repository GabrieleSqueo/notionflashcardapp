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

    // TODO: Replace this with actual Notion connection check
    const isNotionConnected = false

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar userEmail={data.user.email} />
            <MainContent isNotionConnected={isNotionConnected} />
            <DashboardFooter isNotionConnected={isNotionConnected} />
        </div>
    )
}