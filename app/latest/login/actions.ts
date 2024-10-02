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

  // Sign in the user
  const { data: sessionData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    if (error.message.includes('Invalid Refresh Token')) {
      console.error('Invalid refresh token:', error)
      // Clear any existing cookies
      const cookieStore = cookies()
      cookieStore.delete('supabase-auth-token')
      // Redirect to login page with an error message
      redirect('/latest/login?error=session_expired')
    }
    console.error('Login error:', error)
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
  console.log(data)
  try {
    // Create the user in Supabase Auth first
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
        },
      },
    })

    if (authError) {
      console.error('Auth error:', authError)
      redirect('/latest/signup?error=auth_error')
    }

    if (!authData.user) {
      console.error('User not created in auth')
      redirect('/latest/signup?error=user_not_created')
    }

    // Insert the user data into the user_data table
    const { error: dbError } = await supabase
      .from('user_data')
      .insert({
        user_id: authData.user.id,
        email: data.email,
        username: data.username,
        notion_key: ""
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // If db insert fails, we should remove the user from auth
      await supabase.auth.admin.deleteUser(authData.user.id)
      redirect('/latest/signup?error=database_error')
    }

    console.log("User created successfully")
    redirect('/latest/login?message=signup_success')
  } catch (error) {
    console.error('Unexpected error:', error)
    redirect('/latest/signup?error=unexpected_error')
  }
}