import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { Community, CommunitySchema } from 'src/schemas/community.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Community.name, schema: CommunitySchema },
    ])
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService]
})
export class SuperadminModule { }
