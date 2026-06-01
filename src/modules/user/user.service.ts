import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { UserSkill } from 'src/schemas/user-skill.schema';
import { GetUsersSkillsParamsDto, GetUsersSkillsQueriesDto } from './dto/get-users-skills.dto';
import { GetUsersExperiencesParamsDto, GetUsersExperiencesQueriesDto } from './dto/get-users-experiences.dto';
import { Experience } from 'src/schemas/experience.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserSkill.name)
    private readonly userSkillModel: Model<UserSkill>,
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,
  ) { }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId)).select("-password -__v -updatedAt");
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) throw new NotFoundException(err.message);
      throw new InternalServerErrorException("Failed to get user profile");
    }
  }

  async getUserSkills(getUsersSkillsParamsDto: GetUsersSkillsParamsDto, getUsersSkillsQueriesDto: GetUsersSkillsQueriesDto) {
    const page = getUsersSkillsQueriesDto.page || 1;
    const limit = getUsersSkillsQueriesDto.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const userSkills = await this.userSkillModel.find({
        userId: new mongoose.Types.ObjectId(getUsersSkillsParamsDto.userId)
      })
        .populate("skillId", "skillTitle")
        .select("-userId -__v")
        .skip(offset)
        .limit(limit + 1);

      const results = userSkills.slice(0, limit).map(item => {
        return {
          userSkillId: item._id,
          skillId: (item.skillId as unknown as { _id: string })._id,
          skillTitle: (item.skillId as unknown as { skillTitle: string }).skillTitle
        }
      });
      return {
        results,
        hasNextPage: userSkills.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get user skills");
    }
  }

  async getUserExperiences(getUsersExperienceParamsDto: GetUsersExperiencesParamsDto, getUsersExperiencesQueriesDto: GetUsersExperiencesQueriesDto) {
    const page = getUsersExperiencesQueriesDto.page || 1;
    const limit = getUsersExperiencesQueriesDto.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const userExperiences = await this.experienceModel.find({
        userId: new mongoose.Types.ObjectId(getUsersExperienceParamsDto.userId)
      })
        .select("-createdAt -updatedAt -userId -__v")
        .skip(offset)
        .limit(limit + 1);

      const results = userExperiences.slice(0, limit);
      return {
        results,
        hasNextPage: userExperiences.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get user experiences");
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userModel.findById(
      new mongoose.Types.ObjectId(userId),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    try {
      const passwordMatches = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (!passwordMatches) {
        throw new ForbiddenException('Old password is incorrect');
      }
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      try {
        await this.userModel.updateOne(
          { _id: user._id },
          {
            password: hashedPassword,
          },
        );
        return {
          message: "You've successfully changed your password",
        };
      } catch (err) {
        throw new InternalServerErrorException(
          'Failed to update user password',
        );
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) throw new UnauthorizedException(err.message);
      else if (err instanceof ForbiddenException) throw new ForbiddenException(err.message);
      throw new InternalServerErrorException('Failed to change password');
    }
  }
}
