import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostVote, PostVoteSchema } from 'src/schemas/post-votes.schema';
import { CommentModule } from '../comment/comment.module';
import { BullModule } from '@nestjs/bullmq';
import { PostProcessor } from './post.processor';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { CommunityRole } from 'src/entities/community-role.entity';

@Module({
  imports: [
    JwtModule,
    BullModule.registerQueue({
      name: 'posts'
    }),
    MongooseModule.forFeature([
      { name: PostVote.name, schema: PostVoteSchema },
    ]),
    TypeOrmModule.forFeature([
      Post,
      User,
      CommunityRole
    ]),
    MailModule
  ],
  providers: [PostService, PostProcessor],
  controllers: [PostController]
})
export class PostModule { }
