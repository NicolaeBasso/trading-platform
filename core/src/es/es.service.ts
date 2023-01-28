import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Trade } from '../trade/entities/trade.entity';
import { TradeSearchResult, TradeSearchBody } from '../trade/types/es.interface';

@Injectable()
export default class TradesSearchService {
  index = 'trades'

  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) { }

  async indexTrade(trade: Trade) {
    return this.elasticsearchService.index<TradeSearchResult, TradeSearchBody>({
      index: this.index,
      body: {
        id: trade.id,
        type: trade.type,
        isOpen: trade.isOpen,
        tradeSize: trade.tradeSize
      }
    })
  }

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<TradeSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['type', 'isOpen']
          }
        }
      }
    })
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}