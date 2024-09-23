import { NextResponse } from 'next/server';

export async function GET() {
  const authorizationUrl = `https://api.notion.com/v1/oauth/authorize?client_id=10ad872b-594c-80e3-8fc6-0037f00ff279&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fnotionflashcard.com%2Flatest`;

  return NextResponse.json({ authorizationUrl });
}
