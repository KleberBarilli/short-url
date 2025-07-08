import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';

@Injectable()
export class FindUrlByCodeService {
  constructor(private prisma: PrismaService) {}

  async execute(code: string): Promise<{ id: string } | null> {
    return this.prisma.shortUrl.findUnique({
      where: { code },
      select: { id: true },
    });
  }
}
