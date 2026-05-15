import 'dotenv/config';

export const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
if (!ACCESS_TOKEN_EXPIRY || Number.isNaN(Number(ACCESS_TOKEN_EXPIRY))) {
  console.error('ACCESS_TOKEN_EXPIRY is not set');
  process.exit(1);
}

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
if (!REFRESH_TOKEN_EXPIRY || Number.isNaN(Number(REFRESH_TOKEN_EXPIRY))) {
  console.error('REFRESH_TOKEN_EXPIRY is not set');
  process.exit(1);
}

export const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL variable is not set!');
  process.exit(1);
}
