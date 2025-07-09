import { ConflictError } from './conflict.error';
import { PrismaClientError } from './prisma-client.error';

export class UniqueConstraintPrismaError extends ConflictError {
  constructor(e: PrismaClientError) {
    const uniqueField = e.meta?.target;

    super({
      message: `A record with this ${uniqueField} already`,
    });
  }
}
