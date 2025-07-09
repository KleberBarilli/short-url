import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { API_SECRET } from 'src/app/common/constants';
import { TokenPayload } from './types/token-payload';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: API_SECRET,
    });
  }

  validate({
    sub,
    name,
  }: TokenPayload): { sub: string; name: string } | undefined {
    return { sub, name: name };
  }
}
