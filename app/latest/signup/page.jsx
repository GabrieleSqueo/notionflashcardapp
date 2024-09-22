'use client'
import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    try {
      // First, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        // If sign up fails, it might be because the user already exists
        // Let's try to sign in instead
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          // If both sign up and sign in fail, throw the error
          throw signInError
        } else {
          // Sign in successful, redirect to /latest
          router.push('/latest')
          return
        }
      }

      if (signUpData.user && signUpData.session) {
        // Sign-up and auto-login successful, redirect to /latest
        router.push('/latest')
      } else {
        // Sign-up successful, but email confirmation required
        setMessage('Please check your email to confirm your account.')
      }
    } catch (error) {
      if (error.message.includes('Email rate limit exceeded')) {
        setError('Too many signup attempts. Please try again later.')
      } else {
        setError(error.message)
      }
    }
  }

  // ... rest of the component remains the same
}

export default SignUpPage