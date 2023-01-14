export class CreateTradeDto {
  id: string;
  type: string;
  isOpen: boolean;
  pair: string;
  tradeSize: number;
}
