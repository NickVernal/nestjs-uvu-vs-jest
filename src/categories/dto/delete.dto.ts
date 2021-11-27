import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteCategoryRequestParams {
  @ApiProperty()
  @IsUUID(4)
  id: string;
}

export class DeleteCategoryResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';
}
