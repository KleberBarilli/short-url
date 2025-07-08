import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { UserController } from './user.controller';
import { CreateUserService } from 'src/app/core/user/services/create-user.service';
import { FindUserByEmailService } from 'src/app/core/user/services/find-user-by-email.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [CreateUserService, FindUserByEmailService],
})
export class UserModule {}
