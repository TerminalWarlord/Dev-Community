import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Experience, ExperienceSchema } from 'src/schemas/experience.schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Experience.name, schema: ExperienceSchema },
    ])
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService]
})
export class ExperienceModule { }
