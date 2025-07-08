import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';
import { PrismaService } from 'src/infra/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { TokenService } from '../auth/token.service';

jest.mock('bcrypt');

const prismaMock = {
  user: {
    findUnique: jest.fn(),
  },
};

const tokenServiceMock = {
  sign: jest.fn().mockReturnValue('jwt-token'),
};

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'id-1',
      name: 'John',
      password: 'hashed',
    });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    const result = await service.execute({
      email: 'john@email.com',
      password: 'Pwd#01!',
    });
    expect(result).toEqual({ token: 'jwt-token' });
    expect(tokenServiceMock.sign).toHaveBeenCalledWith({
      sub: 'id-1',
      name: 'John',
    });
  });

  it('should throw if user not found', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.execute({ email: 'notfound@email.com', password: 'Pwd#01!' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw if password is invalid', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({
      id: 'id-1',
      name: 'John',
      password: 'hashed',
    });
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
    await expect(
      service.execute({ email: 'john@email.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
