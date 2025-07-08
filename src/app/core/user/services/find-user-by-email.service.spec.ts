import { Test, TestingModule } from '@nestjs/testing';
import { FindUserByEmailService } from './find-user-by-email.service';
import { PrismaService } from 'src/infra/db/prisma.service';

const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
};

describe('FindUserByEmailService', () => {
  let service: FindUserByEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FindUserByEmailService>(FindUserByEmailService);
    jest.clearAllMocks();
  });

  it('should return user id if found', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'id-123' });
    const result = await service.execute('john@email.com');
    expect(result).toEqual({ id: 'id-123' });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@email.com' },
      select: { id: true },
    });
  });

  it('should return null if not found', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    const result = await service.execute('notfound@email.com');
    expect(result).toBeNull();
  });
});
