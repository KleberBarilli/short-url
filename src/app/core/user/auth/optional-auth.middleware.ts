import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TokenService } from './token.service';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        req.user = this.tokenService.verify(token);
      } catch {
        req.user = undefined;
      }
    }
    next();
  }
}
