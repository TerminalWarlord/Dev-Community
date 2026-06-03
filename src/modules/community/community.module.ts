import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { CommunityRole } from 'src/entities/community-role.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
    ]),
    TypeOrmModule.forFeature([
      User,
      Community,
      CommunityRole
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule { }
