import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { LoginDto, SendMessage, UserRegister } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { of } from 'rxjs';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getuser(@Req() req) {
    return this.userService.getUser(req.user);
  }

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile_img'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async Register(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UserRegister,
  ) {
    return this.userService.create(file.filename, data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }

  @Get('allUsers')
  async findAll() {
    return this.userService.findAll();
  }

  @Post('send_message')
  async sendMessage(@Body() data: SendMessage) {
    console.log(data);
  }

  @Get('images/:img')
  async showImg(@Param('img') img: string, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'public', img)));
  }
}
