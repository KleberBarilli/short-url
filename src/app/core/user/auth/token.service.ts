import { Injectable } from '@nestjs/common';
import { TokenPayload } from './types/token-payload';
import { JwtService } from '@nestjs/jwt';
import { API_SECRET, DEFAULT_TOKEN_EXPIRATION } from 'src/app/common/constants';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  sign({ sub, name }: TokenPayload): string {
    const token = this.jwtService.sign(
      {
        sub,
        name: name,
      },
      {
        secret: API_SECRET,
        expiresIn: DEFAULT_TOKEN_EXPIRATION,
      },
    );
    return token;
  }
  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: API_SECRET,
    });
  }
}
