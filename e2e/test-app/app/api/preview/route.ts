import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Check the secret
  if (secret !== 'test-secret') {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // Enable preview mode
  const response = NextResponse.redirect(new URL(`/${slug}`, request.url));
  
  // Set preview cookie
  response.cookies.set('__prerender_bypass', 'true', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    path: '/',
  });

  return response;
}
