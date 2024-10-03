import { createClient } from '../../utils/supabase/server';
import { headers } from 'next/headers';

export const signup = async (formData) => {
  const supabase = createClient();
  const origin = headers().get('origin');
  
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    throw new Error('Could not authenticate user');
  }

  return { message: `Check email (${email}) to continue sign-in process` };
};