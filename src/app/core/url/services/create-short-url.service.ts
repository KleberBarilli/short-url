import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';
import { CreateShortCodeService } from './create-short-code.service';
import { SHORT_CODE_LENGTH } from 'src/app/common/constants';
import { UrlEntity } from '../domain/url.entity';
import { CreateShortUrlResponse } from '../types/CreateShortUrlResponse';

@Injectable()
export class CreateShortUrlService {
  constructor(
    private prisma: PrismaService,
    private createShortCodeService: CreateShortCodeService,
  ) {}

  async execute(originalUrl: string): Promise<CreateShortUrlResponse> {
    const code = await this.createShortCodeService.execute(SHORT_CODE_LENGTH);

    if (!code) {
      throw new ConflictException(
        'Failed to generate a unique short code after multiple attempts.\nTry again later.',
      );
    }

    const urlEntity = new UrlEntity({
      originalUrl,
      code,
      clicks: 0,
    });

    await this.prisma.shortUrl.create({
      data: urlEntity.props,
    });

    return {
      originalUrl: urlEntity.props.originalUrl,
      shortUrl: urlEntity.getShortUrl(),
    };
  }
}
