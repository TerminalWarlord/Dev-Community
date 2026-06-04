import { Module } from '@nestjs/common';
import { SkillController } from './skill.controller';
import { SkillService } from './skill.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { UserSkill } from 'src/entities/user-skill.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Skill,
      UserSkill,
      User
    ])
  ],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule { }
