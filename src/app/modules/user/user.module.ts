import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma.module';
import { UserController } from './user.controller';
import { CreateUserService } from 'src/app/core/user/services/create-user.service';
import { FindUserByEmailService } from 'src/app/core/user/services/find-user-by-email.service';
import { JwtStrategyService } from 'src/app/core/user/auth/jwt-strategy.service';
import { LoginService } from 'src/app/core/user/services/login.service';
import { TokenService } from 'src/app/core/user/auth/token.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  controllers: [UserController],
  providers: [
    CreateUserService,
    FindUserByEmailService,
    JwtStrategyService,
    LoginService,
    TokenService,
  ],
})
export class UserModule {}
