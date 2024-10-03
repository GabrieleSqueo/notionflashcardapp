import { createClient } from '../../utils/supabase/server';
import { headers } from 'next/headers';

export const signup = async (formData) => {
  const supabase = createClient();
  const origin = headers().get('origin');
  
  const username = formData.get('username'); // Get the username
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  // Log the input values for debugging
  console.log('Signing up with:', { username, email, password });

  const { user, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/latest/login`,
      data: { username }, // Store the username in the user metadata
    },
  });

  // Log the error if it exists
  if (error) {
    console.error('Sign up error:', error);
    throw new Error('Could not authenticate user');
  }
  
  console.log(user);
  // Check if user is defined
  if (!user) {
    throw new Error('User object is undefined');
  }

  // Insert user data into the user_data table
  const { error: userDataError } = await supabase
    .from('user_data')
    .insert([
      {
        user_id: user.id,
        email,
        username,
        created_at: new Date(),
      },
    ]);

  if (userDataError) {
    console.error('User data error:', userDataError);
    throw new Error('Could not save user data');
  }

  return { message: `Check email (${email}) to continue sign-in process` };
};