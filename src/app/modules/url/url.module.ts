import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { CreateShortCodeService } from 'src/app/core/url/services/create-short-code.service';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { FindUrlByCodeService } from 'src/app/core/url/services/find-url-by-code.service';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { TokenService } from 'src/app/core/user/auth/token.service';
import { JwtModule } from '@nestjs/jwt';
import { FindManyUrlByUserService } from 'src/app/core/url/services/find-many-url-by-user.service';
import { UpdateOriginalUrlService } from 'src/app/core/url/services/update-original-url.service';
import { DeleteShortUrlService } from 'src/app/core/url/services/delete-short-url.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [UrlController],
  providers: [
    CreateShortCodeService,
    CreateShortUrlService,
    FindUrlByCodeService,
    TokenService,
    FindManyUrlByUserService,
    UpdateOriginalUrlService,
    DeleteShortUrlService,
  ],
})
export class UrlModule {}
