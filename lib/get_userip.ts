import { NextRequest } from 'next/server';

export function getUserIp(req: NextRequest): string | undefined {
  // Check if the 'x-forwarded-for' header is present
  const forwardedFor = req.headers.get('x-forwarded-for');

  // If the 'x-forwarded-for' header exists, return the first IP in the list (real client IP)
  if (forwardedFor) {
    return forwardedFor.split(',')[0];
  }

  // If the 'x-forwarded-for' header is not available, fallback to using req.socket.remoteAddress for local requests
  const remoteAddress = req.headers.get('remote-address'); // This might work depending on the environment
  return remoteAddress || undefined; // Return undefined if the IP is not available
}