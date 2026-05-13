import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from './schemas/user.schema';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'USER_MODEL',
      useValue: UserModel
    }
  ],
  exports: [
    UserService
  ]
})
export class UserModule { }
