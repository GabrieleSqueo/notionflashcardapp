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
  }

  const { data: sessionData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
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