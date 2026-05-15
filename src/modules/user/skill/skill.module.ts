import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from 'src/schemas/skill.schema';
import { UserSkill, UserSkillSchema } from 'src/schemas/user-skill.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: UserSkill.name, schema: UserSkillSchema },
    ])
  ],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule { }
