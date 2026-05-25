import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceModule } from './modules/user/experience/experience.module';
import { CommunityModule } from './modules/community/community.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SuperadminModule } from './modules/superadmin/superadmin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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
    ExperienceModule,
    CommunityModule,
    SuperadminModule,
  ],
})
export class AppModule { }
