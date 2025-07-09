import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';
import { UrlEntity, UrlEntityProps } from '../domain/url.entity';
import { FindManyUrlDto } from 'src/app/modules/url/dtos/find-many-url.dto';

@Injectable()
export class FindManyUrlByUserService {
  constructor(private prisma: PrismaService) {}

  async execute(
    userId: string,
    { skip, sort, order, take }: FindManyUrlDto,
  ): Promise<UrlEntityProps[]> {
    const urls = await this.prisma.shortUrl.findMany({
      where: { userId, deletedAt: null },
      skip,
      take,
      orderBy: { [sort]: order },
    });
    return urls.map((url: UrlEntityProps) => {
      const entity = new UrlEntity(url);
      return {
        ...url,
        shortUrl: entity.getShortUrl(),
      };
    });
  }
}
