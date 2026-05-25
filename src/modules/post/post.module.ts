import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';
import { PostVote, PostVoteSchema } from 'src/schemas/post-votes.schema';
import { CommentModule } from '../comment/comment.module';
import { BullModule } from '@nestjs/bullmq';
import { PostProcessor } from './post.processor';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule,
    BullModule.registerQueue({
      name: 'posts'
    }),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
      { name: PostVote.name, schema: PostVoteSchema },
    ]),
    CommentModule,
    MailModule
  ],
  providers: [PostService, PostProcessor],
  controllers: [PostController]
})
export class PostModule { }
