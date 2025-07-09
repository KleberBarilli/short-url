import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { CreateShortCodeService } from 'src/app/core/url/services/create-short-code.service';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { FindUrlByCodeService } from 'src/app/core/url/services/find-url-by-code.service';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { TokenService } from 'src/app/core/user/auth/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [UrlController],
  providers: [
    CreateShortCodeService,
    CreateShortUrlService,
    FindUrlByCodeService,
    TokenService,
  ],
})
export class UrlModule {}
