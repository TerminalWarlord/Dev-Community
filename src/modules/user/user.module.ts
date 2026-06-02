import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SkillModule } from './skill/skill.module';
import { ExperienceModule } from './experience/experience.module';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';
import { PostVote, PostVoteSchema } from 'src/schemas/post-votes.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Experience } from 'src/entities/experience.entity';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
      { name: PostVote.name, schema: PostVoteSchema },
    ]),
    TypeOrmModule.forFeature([
      User,
      UserSkill,
      Experience
    ]),
    SkillModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
