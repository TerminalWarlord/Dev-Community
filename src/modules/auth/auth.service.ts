import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }
  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.findOne({ email: createUserDto.email });
      if (user) {
        throw new BadRequestException("Email is already in use");
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = await this.userModel.insertOne({
        ...createUserDto,
        password: hashedPassword,
      });
      if (!newUser) {
        throw new InternalServerErrorException('Failed to save user');
      }
      return {
        userId: newUser._id,
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
      };
    }
    catch (err) {
      if (err instanceof NotFoundException) throw new NotFoundException(err.message);
      else if (err instanceof BadRequestException) throw new BadRequestException(err.message);
      else throw new InternalServerErrorException("Failed to create user");

    }
  }
  async logIn(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException("User with that email doesn't exist");
    }
    try {
      const passwordMatches = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!passwordMatches) {
        throw new BadRequestException('Password is invalid');
      }
      const payload = { userId: user._id };
      const JWT_SECRET = this.configService.get<string>("JWT_SECRET");
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
      }
      return {
        userId: user._id,
        access_token: await this.jwtService.signAsync(payload, {
          secret: JWT_SECRET,
          expiresIn: Number(this.configService.get<string>('ACCESS_TOKEN_EXPIRY')),
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          secret: JWT_SECRET,
          expiresIn: Number(this.configService.get<string>('REFRESH_TOKEN_EXPIRY')),
        }),
      };
    } catch (err) {
      throw new BadRequestException('Password is invalid');
    }
  }
}
