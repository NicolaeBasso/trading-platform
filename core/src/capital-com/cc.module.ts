import { Module } from '@nestjs/common';
import { CapitalComGateway } from './cc.ws.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CapitalComGateway],
  exports: [CapitalComGateway],
})
export class CapitalComModule {}
