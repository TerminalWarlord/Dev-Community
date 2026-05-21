import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SkillModule } from './skill/skill.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ExperienceModule } from './experience/experience.module';
import { UserSkill, UserSkillSchema } from 'src/schemas/user-skill.schema';
import { Experience, ExperienceSchema } from 'src/schemas/experience.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';
import { PostVote, PostVoteSchema } from 'src/schemas/post-votes.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSkill.name, schema: UserSkillSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Post.name, schema: PostSchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
      { name: PostVote.name, schema: PostVoteSchema },
    ]),
    SkillModule,
    ExperienceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
