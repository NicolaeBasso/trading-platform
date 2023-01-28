import { TradeType } from "./tradeType"

export interface TradeSearchBody {
  id: string,
  type: TradeType,
  isOpen: boolean,
  tradeSize: number,
}

export interface TradeSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: TradeSearchBody;
    }>;
  };
}