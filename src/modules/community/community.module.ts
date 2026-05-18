import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { CommunityRole, CommunityRoleSchema } from 'src/schemas/community-role.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Community.name, schema: CommunitySchema },
      { name: CommunityRole.name, schema: CommunityRoleSchema },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule { }
