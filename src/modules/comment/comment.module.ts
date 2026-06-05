import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { CommentVote } from 'src/entities/comment-vote.entity';
import { CommunityRole } from 'src/entities/community-role.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([
      User,
      Comment,
      Post,
      CommentVote,
      CommunityRole
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule { }
