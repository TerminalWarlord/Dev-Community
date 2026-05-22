import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Community.name, schema: CommunitySchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    PostModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule { }
