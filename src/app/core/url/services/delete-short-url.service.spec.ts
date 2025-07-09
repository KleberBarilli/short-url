import { Test, TestingModule } from '@nestjs/testing';
import { DeleteShortUrlService } from './delete-short-url.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  shortUrl: {
    update: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('DeleteShortUrlService', () => {
  let service: DeleteShortUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteShortUrlService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<DeleteShortUrlService>(DeleteShortUrlService);
    jest.clearAllMocks();
  });

  it('should soft delete a short url successfully', async () => {
    const urlId = 'url-1';
    const userId = 'user-123';
    const deletedUrl = { id: urlId, deletedAt: new Date() };

    prismaMock.shortUrl.update.mockResolvedValueOnce(deletedUrl);

    await service.execute(urlId, userId);

    expect(prismaMock.shortUrl.update).toHaveBeenCalledWith({
      where: { id: urlId, userId, deletedAt: null },
      data: { deletedAt: expect.any(Date) as Date },
    });
  });
});
