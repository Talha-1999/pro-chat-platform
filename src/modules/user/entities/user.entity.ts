import { Message } from 'src/modules/messages/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  profilePhoto: string;

  @OneToMany(() => Message, (message) => message.author, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  messages: Message[];
}
