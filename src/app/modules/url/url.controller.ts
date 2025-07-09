import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateShortUrlDto,
  CreateShortUrlDtoResponse,
} from './dtos/create-short-url.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateShortUrlService } from 'src/app/core/url/services/create-short-url.service';
import { Request } from 'express';
import { FindManyUrlByUserService } from 'src/app/core/url/services/find-many-url-by-user.service';
import { JwtGuard } from 'src/app/core/user/auth/jwt.guard';
import { FindManyUrlDto } from './dtos/find-many-url.dto';
import { UpdateOriginalUrlService } from 'src/app/core/url/services/update-original-url.service';
import { UpdateOriginalUrlDto } from './dtos/update-original-url.dto';

@Controller('api/urls')
@ApiTags('Urls')
export class UrlController {
  constructor(
    private createShortUrlService: CreateShortUrlService,
    private findManyUrlByUserService: FindManyUrlByUserService,
    private updateOriginalUrlService: UpdateOriginalUrlService,
  ) {}

  @Post('shorten')
  @ApiOperation({
    summary: 'Create a new short URL',
    description: 'Generates an unique short URL for the provided original URL.',
  })
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
  @ApiOperation({
    summary: 'List all URLs for the authenticated user',
    description:
      'Retrieves a paginated list of all URLs created by the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List all URLs for the authenticated user.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
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

  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update original URL for a short URL',
    description:
      'Updates the original URL for a given short URL ID. Only the owner can update it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated original URL.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateOriginalUrl(
    @Req() { user }: Request,
    @Param('id') id: string,
    @Body() { originalUrl }: UpdateOriginalUrlDto,
  ) {
    return this.updateOriginalUrlService.execute(
      id,
      user?.sub as string,
      originalUrl,
    );
  }
}
