import { NextResponse } from 'next/server';

export async function GET() {
  const authorizationUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.OAUTH_CLIENT_ID}&response_type=code&owner=user&redirect_uri=${encodeURIComponent(process.env.OAUTH_REDIRECT_URI)}`;

  // Return the authorization URL
  return NextResponse.json({ authorizationUrl });
}

export async function POST(request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  // Call the route to exchange the code for a token
  const response = await fetch('/api/notiontoken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json({ error: errorData.error || 'Failed to exchange token' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
