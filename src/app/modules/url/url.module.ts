import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { CreateShortCodeService } from 'src/app/core/url/services/create-short-code.service';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { FindUrlByCodeService } from 'src/app/core/url/services/find-url-by-code.service';
import { PrismaModule } from 'src/infra/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UrlController],
  providers: [
    CreateShortCodeService,
    CreateShortUrlService,
    FindUrlByCodeService,
  ],
})
export class UrlModule {}
