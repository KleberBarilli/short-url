import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class IncrementClicksService {
  constructor(private prisma: PrismaService) {}

  async execute(code: string): Promise<string> {
    const url = await this.prisma.shortUrl.update({
      where: { code, deletedAt: null },
      data: { clicks: { increment: 1 }, lastClickedAt: new Date() },
      select: { originalUrl: true },
    });

    return url.originalUrl;
  }
}
