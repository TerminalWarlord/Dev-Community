import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/entities/community.entity';
import { CommunityRole } from 'src/entities/community-role.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    JwtModule,
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
