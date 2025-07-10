import { Test, TestingModule } from '@nestjs/testing';
import { CreateShortUrlService } from './create-short-url.service';
import { PrismaService } from 'src/infra/db/prisma.service';
import { CreateShortCodeService } from './create-short-code.service';
import { FindUrlByCodeService } from './find-url-by-code.service';

const prismaMock = {
  shortUrl: {
    create: jest.fn(),
  },
};

const createShortCodeServiceMock = {
  execute: jest.fn(),
};

const findUrlByCodeServiceMock = {
  execute: jest.fn(),
};

describe('CreateShortUrlService', () => {
  let service: CreateShortUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateShortUrlService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: CreateShortCodeService,
          useValue: createShortCodeServiceMock,
        },
        { provide: FindUrlByCodeService, useValue: findUrlByCodeServiceMock },
      ],
    }).compile();

    service = module.get<CreateShortUrlService>(CreateShortUrlService);
    jest.clearAllMocks();
  });

  it('should create a short url successfully', async () => {
    createShortCodeServiceMock.execute.mockResolvedValueOnce('abc123');
    findUrlByCodeServiceMock.execute.mockResolvedValueOnce(null);
    prismaMock.shortUrl.create.mockResolvedValueOnce({
      id: 'id-1',
      originalUrl: 'https://example.com',
      code: 'abc123',
    });

    const result = await service.execute('https://example.com');
    expect(result.originalUrl).toBe('https://example.com');
    expect(result.shortUrl).toContain('abc123');
    expect(prismaMock.shortUrl.create).toHaveBeenCalledWith({
      data: {
        originalUrl: 'https://example.com',
        code: 'abc123',
        clicks: 0,
        expiresAt: null,
        userId: null,
      },
    });
  });

  it('should throw if code generation fails', async () => {
    createShortCodeServiceMock.execute.mockResolvedValueOnce(null);
    await expect(service.execute('https://example.com')).rejects.toThrow();
  });
});
