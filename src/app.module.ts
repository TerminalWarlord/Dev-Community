import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL variable is not set!');
  process.exit(1);
}
@Module({
  imports: [
    MongooseModule.forRoot(DATABASE_URL, {
      connectionFactory: (connection) => {
        connection.set('bufferCommands', false);
        return connection;
      },
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
