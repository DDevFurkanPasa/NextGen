import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  
  // Clear preview cookie
  response.cookies.delete('__prerender_bypass');

  return response;
}
