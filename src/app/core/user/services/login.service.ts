import * as bcrypt from 'bcrypt';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/app/modules/user/dtos/login.dto';
import { PrismaService } from 'src/infra/db/prisma.service';
import { TokenPayload } from '../auth/types/token-payload';
import { LoginResponse } from '../types/login-response';
import { TokenService } from '../auth/token.service';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async execute({ email, password }: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const tokenPayload: TokenPayload = {
      sub: user.id,
      name: user.name,
    };
    const token = this.tokenService.sign(tokenPayload);

    Logger.verbose(`User logged in: ${user.name}`);

    return { token };
  }
}
