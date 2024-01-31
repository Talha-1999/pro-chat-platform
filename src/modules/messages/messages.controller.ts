import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessage } from './dto/message.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiBearerAuth()
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessagesService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('send/:conversationId')
  async Create(
    @Param('conversationId') id: number,
    @Body() { content }: CreateMessage,
    @Req() req,
  ) {
    const params = { user: req.user, content, id };
    const res = await this.messageService.create(params);
    this.eventEmitter.emit('message.create', res);
    return;
  }

  @Get(':conversationId')
  async getMessagesFromConversation(@Param('conversationId') id: number) {
    const messages = await this.messageService.getMessages(id);
    return { id, messages };
  }
}
