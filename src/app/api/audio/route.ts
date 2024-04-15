import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new NextResponse(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'GET'
      }
    });
  }
  /* In production, this route would do a database/storage call to get a serveable audio file url .
   * For the sake of this project, I downloaded a 10 minute video from youtube and am serving staticly. */

  const staticFileUrl = 'https://mock-ai.netlify.app/mock_recording.wav';

  // Redirect to the static file URL
  return NextResponse.redirect(staticFileUrl);
}


