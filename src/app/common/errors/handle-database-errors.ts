import { PrismaErrors } from '../constants';
import { DatabaseError } from './types/database.error';
import { PrismaClientError } from './types/prisma-client.error';
import { UniqueConstraintPrismaError } from './types/unique-constraint-prisma.error';

export const handleDatabaseErrors = (e: PrismaClientError): Error => {
  switch (e.code) {
    case PrismaErrors.UniqueConstraintFail as string:
      return new UniqueConstraintPrismaError(e);
    case PrismaErrors.DependsOneOrMoreRecordWereNotFound as string:
      return new DatabaseError({
        title: 'This resource was not found',
        message: 'One or more required records were not found.',
      });

    default:
      return new DatabaseError({
        message: e.message,
      });
  }
};
