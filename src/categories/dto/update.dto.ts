import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Category } from '../categories.entity';

export class UpdateCategoryRequestParams {
  @ApiProperty()
  @IsUUID(4)
  id: string;
}

export class UpdateCategoryRequestData {
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
  description: string;
}

export class UpdateCategoryResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ type: Category })
  payload: Category;
}
