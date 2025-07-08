import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class LoginDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pwd#01!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
