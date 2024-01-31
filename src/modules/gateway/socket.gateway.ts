import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Conversation } from '../conversation/entities/conversation.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
  ) {}

  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket, ...args: any[]) {
    const { userId } = { ...socket.handshake.query } as any;
    if (userId != 0) {
      this.connectedClients.set(JSON.parse(userId), socket);
      console.log(`User Connected id=${userId} socket id=${socket.id}`);
      this.emitOnlineUsers(JSON.parse(userId), true, 'connect');
    }
  }

  handleDisconnect(socket: Socket) {
    const { userId } = { ...socket.handshake.query } as any;
    if (userId != 0) {
      this.connectedClients.delete(JSON.parse(userId));
      console.log(`Disconnect is socket id = ${socket.id}`);
      this.emitOnlineUsers(JSON.parse(userId), false, 'disconnect');
    }
  }

  private async emitOnlineUsers(id: any, status: boolean, action: string) {
    const conversation = await this.conversationRepo
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .getMany();

    const res = conversation.map((val) =>
      id == val.creator.id ? val.recipient.id : val.creator.id,
    );

    if (res.length) {
      for (let i = 0; i < res.length; i++) {
        const recipientSocket = this.connectedClients.get(res[i] as any);

        if (recipientSocket) {
          if (action == 'connect') {
            const authorSocket = this.connectedClients.get(id);
            authorSocket.emit('recieveOnlineUser', {
              recipientId: res[i],
              status,
            });
          }
          recipientSocket.emit('recieveOnlineUser', {
            recipientId: id,
            status,
          });
        }
      }
    }
  }

  // Conversation {
  //   creator: User {
  //     id: 1,
  //     username: 'talha',
  //     email: 'talha@gmail.com',
  //     phone_number: '03098800129',
  //     profilePhoto: 'a9184de7e6eba49a54a0fc9cc0fb0f5c'
  //   },
  //   recipient: User {
  //     id: 10,
  //     username: 'usama',
  //     email: 'usama@gmail.com',
  //     password: '$2b$08$UlqMSElR.shvN4UGwSWpQOJlB0rCu.Oqh/HJG1GVDn/..2UR4rc1q',
  //     phone_number: '03174397276',
  //     profilePhoto: 'aecd10bae4fc3a5f9f30be24b034e58e'
  //   },
  //   id: 6,
  //   createdAt: 2024-01-04T20:07:02.574Z
  // }

  @OnEvent('conversation.create')
  handleCreateConversationEvent(payload: any) {
    const creatorSocket = this.connectedClients.get(payload.creator.id);
    if (creatorSocket) creatorSocket.emit('reciveConversationCreate', payload);
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: any) {
    const {
      author,
      content,
      createdAt,
      id,
      conversation: { creator, recipient },
    } = payload.message;
    const { lastMessageSent } = payload.conversation;
    const data = { author, content, createdAt, id };
    const authorSocket = this.connectedClients.get(author.id);
    const recipientSocket =
      author.id === creator.id
        ? this.connectedClients.get(recipient.id)
        : this.connectedClients.get(creator.id);

    if (authorSocket) {
      authorSocket.emit('recieveMessage', data);
      authorSocket.emit('lastMessage', {
        recipientId: author.id == creator.id ? recipient.id : creator.id,
        id: lastMessageSent.id,
        content: lastMessageSent.content,
        createdAt: lastMessageSent.createdAt,
      });
    }

    if (recipientSocket) {
      recipientSocket.emit('recieveMessage', data);
      recipientSocket.emit('lastMessage', {
        recipientId: author.id,
        id: lastMessageSent.id,
        content: lastMessageSent.content,
        createdAt: lastMessageSent.createdAt,
      });
    }
  }
}
