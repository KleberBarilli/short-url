import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOriginalUrlService } from './update-original-url.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  shortUrl: {
    update: jest.fn(),
  },
};

describe('UpdateOriginalUrlService', () => {
  let service: UpdateOriginalUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOriginalUrlService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UpdateOriginalUrlService>(UpdateOriginalUrlService);
    jest.clearAllMocks();
  });

  it('should update the original url successfully', async () => {
    const urlId = 'url-1';
    const userId = 'user-123';
    const newOriginalUrl = 'https://new-url.com';
    const updatedUrl = { id: urlId, originalUrl: newOriginalUrl };

    prismaMock.shortUrl.update.mockResolvedValueOnce(updatedUrl);

    await service.execute(urlId, userId, newOriginalUrl);

    expect(prismaMock.shortUrl.update).toHaveBeenCalledWith({
      where: { id: urlId, userId, deletedAt: null },
      data: { originalUrl: newOriginalUrl },
    });
  });
});
