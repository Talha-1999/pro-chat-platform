import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  recipient_number: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string | undefined;
}
