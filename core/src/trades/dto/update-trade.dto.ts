import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateTradeDto } from './create-trade.dto';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {
  @IsString()
  id: string;
}
