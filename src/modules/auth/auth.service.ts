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
import {
  ACCESS_TOKEN_EXPIRY,
  JWT_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from '../../common/constants';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signUp(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.insertOne({
      ...createUserDto,
      password: hashedPassword,
    });
    if (!user) {
      throw new InternalServerErrorException('Failed to save user');
    }
    return {
      userId: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
    };
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
      return {
        userId: user._id,
        access_token: await this.jwtService.signAsync(payload, {
          secret: JWT_SECRET,
          expiresIn: Number(ACCESS_TOKEN_EXPIRY),
        }),
        refresh_token: await this.jwtService.signAsync(payload, {
          secret: JWT_SECRET,
          expiresIn: Number(REFRESH_TOKEN_EXPIRY),
        }),
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Password is invalid');
    }
  }
}
