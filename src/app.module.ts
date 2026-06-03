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
import { SkillModule } from './modules/user/skill/skill.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get("DATABASE_HOST"),
        username: config.get("DATABASE_USER"),
        password: config.get("DATABASE_PASSWORD"),
        database: config.get("DATABASE_NAME"),
        port: config.get<number>("DATABASE_PORT"),
        type: "postgres",
        ssl: process.env.NODE_ENV === 'production',
        synchronize: process.env.NODE_ENV !== 'production',
        entities: [__dirname + '/entities/*.entity.{js,ts}'],
      }),
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
