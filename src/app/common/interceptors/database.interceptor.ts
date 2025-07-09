import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { isPrismaError } from '../errors/is-prisma-error';
import { handleDatabaseErrors } from '../errors/handle-database-errors';
import { DatabaseError } from '../errors/types/database.error';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  private logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: any) => {
        if (isPrismaError(error)) {
          error = handleDatabaseErrors(error);
        }
        if (error instanceof DatabaseError) {
          this.logger.error(error.message, error.stack, error.name);

          throw new BadRequestException({
            statusCode: 400,
            status: error.status,
            title: error.title,
            message: 'Bad Request',
          });
        } else {
          throw error;
        }
      }),
    );
  }
}
