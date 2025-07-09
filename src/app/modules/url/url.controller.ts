import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateShortUrlDto,
  CreateShortUrlDtoResponse,
} from './dtos/create-short-url.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { Request } from 'express';
import { FindManyUrlByUserService } from 'src/app/core/url/services/find-many-url-by-user.service';
import { JwtGuard } from 'src/app/core/user/auth/jwt.guard';
import { FindManyUrlDto } from './dtos/find-many-url.dto';

@Controller('api/urls')
@ApiTags('Urls')
export class UrlController {
  constructor(
    private createShortUrlService: CreateShortUrlService,
    private findManyUrlByUserService: FindManyUrlByUserService,
  ) {}

  @Post('shorten')
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully.',
    type: CreateShortUrlDtoResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: Could not generate a unique short code.',
  })
  async createShortUrl(
    @Body() data: CreateShortUrlDto,
    @Req() { user }: Request,
  ) {
    return this.createShortUrlService.execute(data.originalUrl, user?.sub);
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all URLs for the authenticated user.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async findAllUrls(
    @Req() { user }: Request,
    @Query() { skip, sort, take, order }: FindManyUrlDto,
  ) {
    return this.findManyUrlByUserService.execute(user?.sub as string, {
      skip,
      take,
      sort,
      order,
    });
  }
}
