import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from './utils/google.serializer';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User
    ]),
    UserModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    SessionSerializer
  ],
})
export class AuthModule { }
