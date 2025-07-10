import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/app/modules/user/dtos/create-user.dto';
import { PrismaService } from 'src/infra/db/prisma.service';
import { FindUserByEmailService } from './find-user-by-email.service';
import { UserEntity, UserEntityProps } from '../domain/user.entity';
import * as bcrypt from 'bcrypt';
import { DEFAULT_HASH_SALT } from 'src/app/common/constants';

@Injectable()
export class CreateUserService {
  constructor(
    private prisma: PrismaService,
    private findUserByEmailService: FindUserByEmailService,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserDto): Promise<UserEntityProps> {
    const existingUser = await this.findUserByEmailService.execute(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, DEFAULT_HASH_SALT);

    const userEntity = new UserEntity();
    userEntity.name = name;
    userEntity.email = email;
    userEntity.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: {
        name: userEntity.name,
        email: userEntity.email,
        password: userEntity.password,
      },
      select: {
        id: true,
      },
    });

    Logger.verbose(`User successfully created: ${name}`);

    return createdUser;
  }
}
