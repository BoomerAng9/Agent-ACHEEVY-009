import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Stubs for internal docker networking if running locally vs in container
  const UEF_URL = process.env.UEF_ENDPOINT || 'http://uef-gateway:3001'; 
  // NOTE: When running Next.js locally (npm run dev), use localhost:3001
  // When in docker, use uef-gateway:3001. 
  // For this bootstrap, we assume docker-compose handles networking.

  try {
    // Forward to UEF Gateway
    // If running in browser (client), we hit this route. This route hits UEF.
    const res = await fetch(`${UEF_URL}/ingress/acp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
        // Fallback for demo if UEF isn't reachable
        console.error("UEF Gateway unreachable, returning mock response");
        return NextResponse.json({
            status: 'ERROR',
            message: 'UEF Gateway unreachable. Ensure Docker is running.'
        }, { status: 503 });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
