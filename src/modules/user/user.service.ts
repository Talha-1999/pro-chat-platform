import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUser(user: any) {
    const result = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email=:email', { email: user.email })
      .getOne();

    return result;
  }

  async findOne(email: string) {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(profilePhoto: string, data: any) {
    try {
      const { username, email, password, phone_number } = data;
      const hashPassword = await bcrypt.hash(password, 8);
      const userAvailable = await this.userRepo.findOne({
        where: { email: data.email },
      });
      if (userAvailable != null) {
        return { status: 201, message: 'User Available' };
      }
      const userCreate = this.userRepo.create({
        username,
        email,
        password: hashPassword,
        phone_number,
        profilePhoto,
      });
      await this.userRepo.save(userCreate);
      return { staus: 201, message: 'User Created Successfully' };
    } catch (err) {
      throw new HttpException('User Not Created', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.userRepo.find();
      if (users.length) return users;
    } catch (err) {
      throw new HttpException('Users Not Available', HttpStatus.BAD_REQUEST);
    }
  }
}
