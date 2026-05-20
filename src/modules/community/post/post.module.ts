import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
    ])
  ],
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule { }
