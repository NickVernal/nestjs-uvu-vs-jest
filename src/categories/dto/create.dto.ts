import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Category } from '../categories.entity';

export class CreateCategoryRequestData {
  @ApiProperty()
  @IsString()
  @MinLength(8)
  slug: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCategoryResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ type: Category })
  payload: Category;
}
