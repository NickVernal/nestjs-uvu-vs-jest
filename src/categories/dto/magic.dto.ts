import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Category } from '../categories.entity';

export class MagicRequestParams {
  @ApiProperty()
  @IsUUID(4)
  id: string;
}

export class MagicResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ type: Category })
  payload: Category;
}
