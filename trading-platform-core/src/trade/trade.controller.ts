import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  create(@Body() createTradeDto: any) {
    console.log({ createTradeDto });
    return this.tradeService.create(createTradeDto);
  }

  @Get('/all')
  findAll() {
    // console.log('findAll!');
    console.log('New!');
    return this.tradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(id, updateTradeDto);
  }

  @Patch('/close/:id')
  close(@Param('id') id: string) {
    return this.tradeService.close(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tradeService.remove(id);
  }
}
