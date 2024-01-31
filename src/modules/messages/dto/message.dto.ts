import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessage {
  @ApiProperty()
  @IsString()
  content: string;
}
