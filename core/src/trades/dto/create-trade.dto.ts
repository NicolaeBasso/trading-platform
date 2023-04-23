import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';
import { TradeType } from '../types/trade-type.type';

export class CreateTradeDto {
  @IsOptional()
  @IsString()
  type?: TradeType;

  @IsBoolean()
  isOpen: boolean;

  @IsString()
  pair: string;

  @IsNumber()
  tradeSize: number;
}
