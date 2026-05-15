import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SkillModule } from './skill/skill.module';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SkillModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
