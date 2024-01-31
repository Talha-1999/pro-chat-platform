import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateConversationDto } from './dto/conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from '../messages/entities/message.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
  ) {}

  async getConversations(id: number): Promise<Conversation[]> {
    return this.conversationRepo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .getMany();
  }

  async isCreated(userId: number, recipientId: number) {
    return this.conversationRepo.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }

  async create(creator: any, data: CreateConversationDto) {
    const { recipient_number, message } = data;
    const recipient = await this.userRepo.findOne({
      where: { phone_number: recipient_number },
    });
    if (!recipient)
      throw new HttpException('User not Found', HttpStatus.BAD_REQUEST);
    if (creator.id == recipient.id)
      throw new HttpException(
        'Cannot create Conversation with yourself',
        HttpStatus.BAD_REQUEST,
      );

    const exists = await this.isCreated(creator.id, recipient.id);
    if (exists)
      throw new HttpException(
        'Conversation Already Exist',
        HttpStatus.BAD_REQUEST,
      );
    const newConversation = this.conversationRepo.create({
      creator,
      recipient,
    });
    const conversation = await this.conversationRepo.save(newConversation);
    if (message.length) {
      const newMessage = this.messageRepo.create({
        content: message,
        conversation,
        author: creator,
      });
      await this.messageRepo.save(newMessage);
    }
    return conversation;
  }

  async findById(id: number) {
    return this.conversationRepo.findOne({
      where: { id },
      relations: ['creator', 'recipient'],
    });
  }
}
