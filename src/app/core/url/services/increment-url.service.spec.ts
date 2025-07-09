import { Test, TestingModule } from '@nestjs/testing';
import { IncrementClicksService } from './increment-clicks.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  shortUrl: {
    update: jest.fn(),
  },
};

describe('IncrementClicksService', () => {
  let service: IncrementClicksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncrementClicksService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<IncrementClicksService>(IncrementClicksService);
    jest.clearAllMocks();
  });

  it('should increment clicks and return originalUrl', async () => {
    const code = 'abc123';
    const originalUrl = 'https://example.com';
    prismaMock.shortUrl.update.mockResolvedValueOnce({ originalUrl });

    const result = await service.execute(code);

    expect(prismaMock.shortUrl.update).toHaveBeenCalledWith({
      where: { code, deletedAt: null },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: expect.any(Date) as Date,
      },
      select: { originalUrl: true },
    });
    expect(result).toBe(originalUrl);
  });
});
