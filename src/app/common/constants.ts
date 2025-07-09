export const SHORT_CODE_LENGTH = 6;
export const CREATE_SHORT_CODE_MAX_RETRIES = 3;
export const DEFAULT_HASH_SALT = 12;
export const API_SECRET = process.env.API_SECRET || 'default_secret';
export const DEFAULT_TOKEN_EXPIRATION = '7d';
export const DEFAULT_API_URL = process.env.API_URL || 'http://localhost:3333';

export enum PrismaErrors {
  UniqueConstraintFail = 'P2002',
  DependsOneOrMoreRecordWereNotFound = 'P2025',
}
