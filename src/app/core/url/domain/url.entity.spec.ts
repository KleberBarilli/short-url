import { UrlEntity, UrlEntityProps } from './url.entity';

describe('UrlEntity', () => {
  const urlProps: UrlEntityProps = {
    id: 'id-123',
    userId: 'user-456',
    originalUrl: 'https://example.com',
    code: 'abc123',
    clicks: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    lastClickedAt: null,
  };

  it('should instantiate UrlEntity', () => {
    const url = new UrlEntity({ ...urlProps });
    expect(url).toBeDefined();
    expect(url.props.originalUrl).toBe('https://example.com');
    expect(url.props.code).toBe('abc123');
    expect(url.props.clicks).toBe(0);
  });

  it('should return the short url', () => {
    const url = new UrlEntity({ ...urlProps });
    const shortUrl = url.getShortUrl();
    expect(shortUrl).toContain(urlProps.code);
  });
});
