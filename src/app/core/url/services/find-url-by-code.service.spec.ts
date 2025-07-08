import { Test, TestingModule } from '@nestjs/testing';
import { FindUrlByCodeService } from './find-url-by-code.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  shortUrl: {
    findUnique: jest.fn(),
  },
};

describe('FindUrlByCodeService', () => {
  let service: FindUrlByCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUrlByCodeService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FindUrlByCodeService>(FindUrlByCodeService);
    jest.clearAllMocks();
  });

  it('should return url id if found', async () => {
    prismaMock.shortUrl.findUnique.mockResolvedValueOnce({ id: 'id-123' });
    const result = await service.execute('abc123');
    expect(result).toEqual({ id: 'id-123' });
    expect(prismaMock.shortUrl.findUnique).toHaveBeenCalledWith({
      where: { code: 'abc123' },
      select: { id: true },
    });
  });

  it('should return null if not found', async () => {
    prismaMock.shortUrl.findUnique.mockResolvedValueOnce(null);
    const result = await service.execute('notfound');
    expect(result).toBeNull();
  });
});
