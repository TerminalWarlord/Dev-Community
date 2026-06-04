import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceModule } from './modules/user/experience/experience.module';
import { CommunityModule } from './modules/community/community.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillModule } from './modules/skill/skill.module';
import AppDataSource from "./data-source";

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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("DATABASE_URL"),
        connectionFactory: (connection) => {
          connection.set('bufferCommands', false);
          return connection;
        }
      })
    }),
    UserModule,
    AuthModule,
    // ExperienceModule,
    CommunityModule,
    SuperadminModule,
    SkillModule,
    // ExperienceModule
  ],
})
export class AppModule { }
