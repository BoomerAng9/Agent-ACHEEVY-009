/**
 * Discord Interactions — Request Verification
 *
 * Verifies incoming Discord webhook requests using Ed25519 signatures.
 * Required by Discord for all interaction endpoints.
 */

/**
 * Verify Discord interaction request signature
 * Uses the Web Crypto API (available in Edge Runtime / Node 18+)
 */
export async function verifyDiscordRequest(
  body: string,
  signature: string,
  timestamp: string,
  publicKey: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();

    // Import the public key
    const keyData = hexToUint8Array(publicKey);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'Ed25519' },
      false,
      ['verify']
    );

    // Prepare the message (timestamp + body)
    const message = encoder.encode(timestamp + body);
    const sig = hexToUint8Array(signature);

    // Verify the signature
    return await crypto.subtle.verify('Ed25519', cryptoKey, sig, message);
  } catch (error) {
    console.error('[Discord] Signature verification failed:', error);
    return false;
  }
}

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
