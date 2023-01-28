import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTradeDto {
  @IsOptional()
  @IsString()
  type?: string;
  @IsBoolean()
  isOpen: boolean;
  @IsString()
  pair: string;
  @IsNumber()
  tradeSize: number;
}
