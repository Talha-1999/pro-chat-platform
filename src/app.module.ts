import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './modules/config/typeorm.config';
import { AppController } from './app.controller';
import { ConversationModule } from './modules/conversation/conversation.module';
import { MessagesModule } from './modules/messages/messages.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    ConversationModule,
    MessagesModule,
    GatewayModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
