import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserRegister {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile Image to upload',
    required: false,
  })
  profile_img?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class SendMessage {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  senderId: any;

  @ApiProperty()
  recieverId: any;
}
