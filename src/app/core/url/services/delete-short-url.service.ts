import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class DeleteShortUrlService {
  constructor(private prisma: PrismaService) {}

  async execute(id: string, userId: string): Promise<void> {
    await this.prisma.shortUrl.update({
      where: { id, userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
