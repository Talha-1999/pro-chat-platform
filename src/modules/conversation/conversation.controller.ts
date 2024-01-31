import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/conversation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiBearerAuth()
@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async Create(@Body() params: CreateConversationDto, @Req() req) {
    const res = await this.conversationService.create(req.user, params);
    this.eventEmitter.emit('conversation.create', res);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getConversations(@Req() req) {
    return this.conversationService.getConversations(req.user.id);
  }

  @Get(':conversationId')
  async getConversationById(@Param('conversationId') id: number) {
    return this.conversationService.findById(id);
  }
}
