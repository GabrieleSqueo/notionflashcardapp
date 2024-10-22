'use server';

import { createClient } from '../../utils/supabase/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createInitialUser(checkoutSessionId) {
  const supabase = createClient();

  try {
    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ['customer', 'subscription', 'payment_intent']
    });

    if (!session || session.payment_status !== 'paid') {
      return { error: 'Invalid or unpaid checkout session' };
    }

    const email = session.customer_details.email;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_data')
      .select('user_id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { userId: existingUser.user_id, message: 'User already exists' };
    }

    // Create a new user without a password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: crypto.randomUUID(), // Temporary random password
    });

    if (authError) {
      console.error(authError);
      return { error: 'Could not create user' };
    }

    // Add user data to the user_data table
    const { error: userDataError } = await supabase
      .from('user_data')
      .insert({
        user_id: authData.user.id,
        email: email,
        stripe_customer_id: session.customer,
        stripe_checkout_session_id: session.id,
        stripe_subscription_id: session.subscription,
        stripe_payment_method_id: session.payment_intent ? session.payment_intent.payment_method : null,
        stripe_status: session.payment_status,
        subscription_status: 'active',
        subscription_type: session.metadata.product_name,
      });

    if (userDataError) {
      console.error(userDataError);
      // If we fail to insert user data, we should delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: 'Could not create user data' };
    }

    return { userId: authData.user.id, message: 'User created successfully' };
  } catch (error) {
    console.error('Error in createInitialUser:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function updateUserPassword(userId, password) {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: password,
    });

    if (error) {
      throw error;
    }

    return { message: 'Password set successfully' };
  } catch (error) {
    console.error('Error updating user password:', error);
    return { error: 'Could not update password' };
  }
}
