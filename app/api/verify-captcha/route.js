import { NextResponse } from 'next/server'

export async function POST(req) {
  const body = await req.json()
  const { captchaToken } = body

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`

  try {
    const response = await fetch(verificationUrl, { method: 'POST' })
    const data = await response.json()

    return NextResponse.json({ success: data.success })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}