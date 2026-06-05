import { Module } from '@nestjs/common';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { Community } from 'src/entities/community.entity';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([
      User,
      Post,
      Comment,
      Community
    ])
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService]
})
export class SuperadminModule { }
