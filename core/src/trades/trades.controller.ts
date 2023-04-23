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
import { TradeService } from './trades.service';
import { Roles } from '../utils/constants';
import { RolesDecorator } from '../utils/decorators/roles.decorator';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('open')
  create(
    @Body()
    createTradeDto: CreateTradeDto,
  ) {
    return this.tradeService.create(createTradeDto);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(id, updateTradeDto);
  }

  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  @Patch('close/:id')
  close(@Param('id') id: string) {
    return this.tradeService.close(id);
  }

  @RolesDecorator(Roles.USER)
  @Get('all')
  findAll() {
    return this.tradeService.findAll();
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(id);
  }

  @Delete('/removeAll')
  @RolesDecorator(Roles.ADMIN)
  @UseGuards(RolesGuard)
  removeAll() {
    return this.tradeService.removeAll();
  }
}
