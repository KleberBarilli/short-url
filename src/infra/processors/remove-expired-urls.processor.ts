import { Logger } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

const prisma = new PrismaService();
const logger = new Logger('RemoveExpiredUrlsProcessor');

export const removeExpiredUrlsProcessor = async () => {
  try {
    const deletedUrls = await prisma.shortUrl.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    logger.log(`Removed ${deletedUrls.count} expired URLs.`);
  } catch (error) {
    logger.error('Error removing expired URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
};
