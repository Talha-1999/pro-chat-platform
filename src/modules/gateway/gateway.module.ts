import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  providers: [SocketGateway],
})
export class GatewayModule {}
