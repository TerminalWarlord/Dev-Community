import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Experience } from 'src/entities/experience.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      User,
      UserSkill,
      Experience
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
