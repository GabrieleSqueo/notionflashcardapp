'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '../../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: sessionData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/latest/error')
  }

  if (sessionData?.session) {
    cookies().set('supabase-auth-token', sessionData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
  }

  revalidatePath('/', 'layout')
  redirect('/latest')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    username: formData.get('username') as string,
  }

  // Insert the user data into the user_data table
  const { error: dbError } = await supabase
    .from('user_data')
    .insert({
      email: data.email,
      password: data.password, // Note: Storing passwords in plain text is not secure. Use hashing in a real application.
      username: data.username,
      notion_key: "" // Set notion_key to an empty string
    })

  if (dbError) {
    console.error('Database error:', dbError)
    redirect('/latest/error')
  }

  redirect('/latest/login')
}