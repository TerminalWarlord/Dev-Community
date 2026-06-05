import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommunityModule } from './modules/community/community.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillModule } from './modules/skill/skill.module';
import AppDataSource from "./data-source";
import { ExperienceModule } from './modules/experience/experience.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => AppDataSource.options,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          url: config.get<string>('REDIS_CONNECTION_URL')
        }
      }),
    }),
    UserModule,
    AuthModule,
    ExperienceModule,
    CommunityModule,
    SuperadminModule,
    SkillModule,
    PostModule,
    CommentModule
  ],
})
export class AppModule { }
