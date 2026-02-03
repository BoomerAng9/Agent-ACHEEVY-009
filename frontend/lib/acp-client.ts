export async function sendACPRequest(message: string, userId: string = 'anon') {
  try {
    const res = await fetch('/api/acp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId,
        intent: 'CHAT' // Simplification for demo
      }),
    });

    if (!res.ok) {
      throw new Error(`ACP Error: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
