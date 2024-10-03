import { createClient } from '../../utils/supabase/server'; // Adjust the import path as necessary

export async function POST(request) {
  const { username, email, password } = await request.json();

  // Create a Supabase client
  const supabase = createClient();

  // Create a new user in the auth.users table
  const { user, error: authError } = await supabase.auth.signUp({
    email,
    password,
    data: { username }, // Store additional user data
  });

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
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
    return new Response(JSON.stringify({ error: userDataError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ user }), { status: 201 });
}