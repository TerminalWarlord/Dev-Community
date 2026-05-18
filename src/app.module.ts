import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { DATABASE_URL } from './common/constants';
import { ExperienceModule } from './modules/user/experience/experience.module';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL!, {
      connectionFactory: (connection) => {
        connection.set('bufferCommands', false);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    ExperienceModule,
  ],
})
export class AppModule {}
