import { IsOptional, IsString } from 'class-validator';

export class GetAllTradesDto {
  @IsOptional()
  @IsString()
  filter: 'open' | 'closed' | 'all';
}
