import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../categories.entity';

export class ReceiveManyResponse {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ type: Category, isArray: true })
  payload: Category[];
}
