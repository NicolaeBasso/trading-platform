import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';
import { TradeType } from '../types/trade-type.type';

export class CreateTradeDto {
  @IsOptional()
  @IsString()
  type?: TradeType;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsBoolean()
  isLong?: boolean;

  @IsString()
  pair: string;

  @IsOptional()
  @IsNumber()
  leverageRatio: number;

  @IsNumber()
  tradeSize: number;
}
