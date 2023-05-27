import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RolesGuard } from '../utils/guards/roles.guard';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradeService } from './trades.service';
import { Roles } from '../utils/constants';
import { RolesDecorator } from '../utils/decorators/roles.decorator';
import { GetAllTradesDto } from './dto/all-trades.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradeService: TradeService) {}

  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  @Post('open')
  create(@Body() createTradeDto: CreateTradeDto, @Req() req: Request) {
    return this.tradeService.create({ createTradeDto, user: req.user });
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradeService.update(id, updateTradeDto);
  }

  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  @Patch('close/:id')
  close(@Param('id') id: string, @Req() req: Request) {
    return this.tradeService.close({ id, user: req.user });
  }

  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll(@Query() filter: GetAllTradesDto) {
    return this.tradeService.findAll(filter);
  }

  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tradeService.findOne(id);
  }

  @Delete('/removeAll')
  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  removeAll() {
    return this.tradeService.removeAll();
  }
}
