import { Module } from '@nestjs/common';
import { CapitalComWebSocketGateway } from './cc.ws.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CapitalComWebSocketGateway],
  exports: [CapitalComWebSocketGateway],
})
export class CapitalComModule {}
