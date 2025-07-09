import { Test, TestingModule } from '@nestjs/testing';
import { FindManyUrlByUserService } from './find-many-url-by-user.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  shortUrl: {
    findMany: jest.fn(),
  },
};

describe('FindManyUrlByUserService', () => {
  let service: FindManyUrlByUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindManyUrlByUserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FindManyUrlByUserService>(FindManyUrlByUserService);
    jest.clearAllMocks();
  });

  it('should return urls for a user with correct filters', async () => {
    const userId = 'user-1';
    const dto = { skip: 0, take: 10, sort: 'createdAt', order: 'desc' };
    const urls = [
      { id: '1', userId, originalUrl: 'http://a.com', code: 'abc', clicks: 0 },
    ];
    prismaMock.shortUrl.findMany.mockResolvedValueOnce(urls);

    const result = await service.execute(userId, dto);

    expect(prismaMock.shortUrl.findMany).toHaveBeenCalledWith({
      where: { userId, deletedAt: null },
      skip: dto.skip,
      take: dto.take,
      orderBy: { [dto.sort]: dto.order },
    });
    expect(result).toBe(urls);
  });

  it('should return empty array if no urls found', async () => {
    prismaMock.shortUrl.findMany.mockResolvedValueOnce([]);
    const result = await service.execute('user-2', {
      skip: 0,
      take: 10,
      sort: 'createdAt',
      order: 'asc',
    });
    expect(result).toEqual([]);
  });
});
