import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { DATABASE_URL, REDIS_CONNECTION_URL } from './common/constants';
import { ExperienceModule } from './modules/user/experience/experience.module';
import { CommunityModule } from './modules/community/community.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: REDIS_CONNECTION_URL
      },
    }),
    MongooseModule.forRoot(DATABASE_URL!, {
      connectionFactory: (connection) => {
        connection.set('bufferCommands', false);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    ExperienceModule,
    CommunityModule,
  ],
})
export class AppModule { }
