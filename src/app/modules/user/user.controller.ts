import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto, CreateUserDtoResponse } from './dtos/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserService } from 'src/app/core/user/services/create-user.service';

@Controller('api/users')
@ApiTags('Users')
export class UserController {
  constructor(private createUserService: CreateUserService) {}

  @ApiOperation({
    summary: 'Create a new user',
    description:
      '*The password field must be strong. See the schema below for password requirements.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: CreateUserDtoResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User with this email already exists.',
  })
  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.createUserService.execute(data);
  }
}
