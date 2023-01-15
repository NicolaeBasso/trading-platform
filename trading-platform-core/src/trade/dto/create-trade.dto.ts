export class CreateTradeDto {
  public id: string;
  public type: string;
  public isOpen: boolean;
  public pair: string;
  public tradeSize: number;
}
