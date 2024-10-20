'use server';

import { createClient } from '../../utils/supabase/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function signup(formData) {
  const supabase = createClient();
  const origin = headers().get('origin');

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const username = formData.get("username")?.toString();
  const checkoutSessionId = formData.get("checkoutSessionId")?.toString();

  if (!email || !password || !confirmPassword || !username || !checkoutSessionId) {
    return { error: 'All fields are required' };
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  try {
    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

    if (!session || session.payment_status !== 'paid') {
      return { error: 'Invalid or unpaid checkout session' };
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (authError) {
      console.error(authError);
      return { error: 'Could not authenticate user' };
    }

    if (!authData.user) {
      return { error: 'User data is missing after signup' };
    }

    // Add user data to the user_data table
    const { error: userDataError } = await supabase
      .from('user_data')
      .insert({
        user_id: authData.user.id,
        email: email,
        username: username,
        stripe_customer_id: session.customer,
        subscription_status: 'active',
        subscription_type: session.metadata.product_name,
      });

    if (userDataError) {
      console.error(userDataError);
      // If we fail to insert user data, we should delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: 'Could not create user data' };
    }

    return { message: "Account created successfully. Please check your email to confirm your account." };
  } catch (error) {
    console.error('Error in signup process:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateUser(formData) {
  const supabase = createClient();

  const email = formData.get("email")?.toString();
  const username = formData.get("username")?.toString();

  if (!email || !username) {
    return { error: 'Email and username are required' };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw userError;
    }

    const { error: updateError } = await supabase
      .from('user_data')
      .update({ email, username })
      .eq('user_id', userData.user.id);

    if (updateError) {
      throw updateError;
    }

    return { message: "User information updated successfully." };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'Could not update user information' };
  }
}
