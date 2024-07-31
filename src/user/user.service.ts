import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOneBy({ username, password });
    if (user === null) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      id: user.id,
      username: user.username,
      realname: user.realname,
    };
    return { ...payload, token: await this.jwtService.sign(payload) };
  }
}