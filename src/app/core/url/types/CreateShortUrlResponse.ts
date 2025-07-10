export interface CreateShortUrlResponse {
  originalUrl: string;
  shortUrl: string;
  expiresAt?: Date | null;
}
