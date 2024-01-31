import { Message } from 'src/modules/messages/entities/message.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'conversations' })
@Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: User;

  @OneToMany(() => Message, (message) => message.conversation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  messages: Message[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Message, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: Message;
}
