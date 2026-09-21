import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'wf_session';
const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export type SpotifySession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export async function signSession(session: SpotifySession): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifySession(token: string): Promise<SpotifySession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.accessToken !== 'string' ||
      typeof payload.refreshToken !== 'string' ||
      typeof payload.expiresAt !== 'number'
    ) {
      return null;
    }
    return {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
