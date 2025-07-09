import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateOriginalUrlDto {
  @ApiProperty({
    description: 'The new original URL to be updated',
    example:
      'https://press-start.com.au/wp-content/uploads/2022/02/Elden-Ring-Reviewwww-770x433.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
