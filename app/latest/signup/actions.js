'use server';

import { createClient } from '../../utils/supabase/server';
import { headers } from 'next/headers';

export async function signup(formData) {
  const supabase = createClient();
  const origin = headers().get('origin');

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const username = formData.get("username")?.toString();

  if (!email || !password || !confirmPassword || !username) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `https://notionflashcard.com/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return { error: 'Could not authenticate user' };
  }

  // Add user data to the user_data table
  const { error: userDataError } = await supabase
    .from('user_data')
    .insert({
      user_id: authData.user.id,
      email: email,
      username: username,
    });

  if (userDataError) {
    console.error(userDataError.code + " " + userDataError.message);
    return { error: 'Could not create user data' };
  }

  return { message: "Thanks for signing up! Please check your email to complete the registration process." };
}