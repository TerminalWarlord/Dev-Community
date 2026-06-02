import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordBodyDto, ChangePasswordRequestDto } from './dto/change-password.dto';
import bcrypt from 'bcrypt';
import { GetUsersSkillsParamsDto, GetUsersSkillsQueriesDto } from './dto/get-users-skills.dto';
import { GetUsersExperiencesParamsDto, GetUsersExperiencesQueriesDto } from './dto/get-users-experiences.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Experience } from 'src/entities/experience.entity';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(UserSkill)
    private readonly userSkillRepo: Repository<UserSkill>,
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) { }

  async getUserProfile(userId: number) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: userId
        },
        select: {
          id: true,
          avatar: true,
          email: true,
          fname: true,
          lname: true,
        }
      })
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
    const page = parseInt(getUsersSkillsQueriesDto.page || "1");
    const limit = parseInt(getUsersSkillsQueriesDto.limit || "10");
    const offset = (page - 1) * limit;
    try {
      console.log(parseInt(getUsersSkillsParamsDto.userId))
      const userSkills = await this.userSkillRepo.find({
        where: {
          user: {
            id: parseInt(getUsersSkillsParamsDto.userId)
          }
        },
        skip: offset,
        take: limit + 1,
        relations: {
          skill: true,
          user: true
        }
      })
      const results = userSkills.slice(0, limit).map(item => {
        return {
          userSkillId: item.id,
          skillId: item.skill.id,
          skillTitle: item.skill.skillTitle
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
    const page = parseInt(getUsersExperiencesQueriesDto.page || "1");
    const limit = parseInt(getUsersExperiencesQueriesDto.limit || "10");
    const offset = (page - 1) * limit;
    try {
      const userExperiences = await this.experienceRepo.find({
        where: {
          user: {
            id: parseInt(getUsersExperienceParamsDto.userId)
          }
        },
        skip: offset,
        take: limit + 1,
      });
      const results = userExperiences.slice(0, limit);
      return {
        results,
        hasNextPage: userExperiences.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get user experiences");
    }
  }

  async changePassword(
    changePasswordBodyDto: ChangePasswordBodyDto,
    changePasswordRequestDto: ChangePasswordRequestDto,
  ) {
    const userId = parseInt(changePasswordRequestDto.userId);
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId
      }
    }
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    try {
      const passwordMatches = await bcrypt.compare(
        changePasswordBodyDto.oldPassword,
        user.password,
      );
      if (!passwordMatches) {
        throw new ForbiddenException('Old password is incorrect');
      }
      const hashedPassword = await bcrypt.hash(
        changePasswordBodyDto.newPassword,
        10,
      );
      try {
        await this.userRepo.update(
          { id: user.id },
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
