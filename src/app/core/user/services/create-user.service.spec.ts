import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { PrismaService } from 'src/infra/db/prisma.service';
import { FindUserByEmailService } from './find-user-by-email.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const prismaMock = {
  user: {
    create: jest.fn(),
  },
};

const findUserByEmailServiceMock = {
  execute: jest.fn(),
};

describe('CreateUserService', () => {
  let service: CreateUserService;

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: FindUserByEmailService,
          useValue: findUserByEmailServiceMock,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    findUserByEmailServiceMock.execute.mockResolvedValueOnce(null);
    prismaMock.user.create.mockResolvedValueOnce({
      id: 'id-1',
      name: 'John',
      email: 'john@email.com',
      password: 'hashed-password',
    });

    const result = await service.execute({
      name: 'John',
      email: 'john@email.com',
      password: 'Pwd#01!',
    });
    expect(result).toHaveProperty('id', 'id-1');
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        name: 'John',
        email: 'john@email.com',
        password: 'hashed-password',
      },
    });
  });

  it('should throw if user already exists', async () => {
    findUserByEmailServiceMock.execute.mockResolvedValueOnce({ id: 'id-1' });
    await expect(
      service.execute({
        name: 'John',
        email: 'john@email.com',
        password: 'Pwd#01!',
      }),
    ).rejects.toThrow();
  });
});
