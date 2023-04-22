import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../utils/guards/roles.guard';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post()
  create(
    @Body()
    createTradeDto: CreateTradeDto,
  ) {
    console.log({ createTradeDto });
    return this.tradeService.create(createTradeDto);
  }

  @Get('all')
  findAll() {
    return this.tradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(id, updateTradeDto);
  }

  @Patch('close/:id')
  close(@Param('id') id: string) {
    return this.tradeService.close(id);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.tradeService.remove(id);
  }

  @Delete('/removeAll')
  // @RolesDecorator(Roles.ADMIN)
  @UseGuards(RolesGuard)
  // @Throttle(10, 1)
  removeAll() {
    return this.tradeService.removeAll();
  }
}
