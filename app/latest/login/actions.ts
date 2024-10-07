'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '../../utils/supabase/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import bcrypt from 'bcrypt'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password. Please try again.' }
    } else if (error.message.includes('Invalid Refresh Token')) {
      return { error: 'Your session has expired. Please log in again.' }
    } else if (error.message.includes('Email not confirmed')) {
      return { error: 'Please confirm your email address before logging in.' }
    } else {
      return { error: 'An error occurred during login. Please try again later.' }
    }
  }

  return { data }
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