'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '../../utils/supabase/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import bcrypt from 'bcrypt'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Fetch user from the database
  const { data: user, error: fetchError } = await supabase
    .from('user_data')
    .select('password')
    .eq('email', data.email)
    .single()

  if (fetchError || !user) {
    redirect('/latest/error')
  }

  // Compare the provided password with the stored hash
  const passwordMatch = await bcrypt.compare(data.password, user.password)

  if (!passwordMatch) {
    redirect('/latest/error')
  }

  // Sign in the user
  const { data: sessionData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    redirect('/latest/error')
  }

  if (sessionData?.session) {
    const cookieStore = cookies()
  
    const cookieOptions: Partial<ResponseCookie> = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    }
  
    cookieStore.set('supabase-auth-token', sessionData.session.access_token, cookieOptions)
  }

  revalidatePath('/', 'layout')
  redirect('/latest')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
  }

  try {
    // Insert the user data into the user_data table first
    const { error: dbError } = await supabase
      .from('user_data')
      .insert({
        email: data.email,
        username: data.username,
        notion_key: ""
      })

    if (dbError) {
      console.error('Database error:', dbError)
      redirect('/latest/error')
    }

    // Create the user in Supabase Auth
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      console.error('Auth error:', authError)
      // If auth fails, we should remove the user from user_data table
      await supabase
        .from('user_data')
        .delete()
        .match({ email: data.email })
      redirect('/latest/error')
    }

    console.log("User created successfully")
    redirect('/latest/login')
  } catch (error) {
    console.error('Unexpected error:', error)
    redirect('/latest/error')
  }
}