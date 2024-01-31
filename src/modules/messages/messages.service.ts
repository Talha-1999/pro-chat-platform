import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '../conversation/entities/conversation.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
  ) {}

  async create(data: any) {
    try {
      const { user, content, id } = data;
      const conversation = await this.conversationRepo.findOne({
        where: { id },
        relations: ['creator', 'recipient'],
      });
      if (!conversation)
        throw new HttpException(
          'Conversation Not Found',
          HttpStatus.BAD_REQUEST,
        );
      const { creator, recipient } = conversation;

      if (creator.id !== user.id && recipient.id !== user.id)
        throw new HttpException(
          'User Not a creator or a recipient',
          HttpStatus.BAD_GATEWAY,
        );
      const message = this.messageRepo.create({
        content,
        conversation,
        author: user,
      });

      const saveMessage = await this.messageRepo.save(message);
      conversation.lastMessageSent = saveMessage;
      const updated = await this.conversationRepo.save(conversation);
      return { message: saveMessage, conversation: updated };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepo.find({
      relations: ['author'],
      where: { conversation: { id: conversationId } },
      // order: { createdAt: 'DESC' },
    });
  }
}
