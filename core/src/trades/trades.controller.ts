import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
  // @UseGuards(RolesGuard)
  @Post('open')
  create(
    @Body()
    createTradeDto: CreateTradeDto,
  ) {
    console.log('createTradeDto', createTradeDto);

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
    console.log('close trade with id = ', id);

    return this.tradeService.close(id);
  }

  @RolesDecorator(Roles.USER)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll(@Query() filter: GetAllTradesDto) {
    console.log('getAllTradesDto', filter);

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
