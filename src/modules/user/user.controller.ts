import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordBodyDto, ChangePasswordRequestDto } from './dto/change-password.dto';
import { GetUsersSkillsParamsDto, GetUsersSkillsQueriesDto } from './dto/get-users-skills.dto';
import { GetUsersExperiencesParamsDto, GetUsersExperiencesQueriesDto } from './dto/get-users-experiences.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordBodyDto: ChangePasswordBodyDto,
    @Request() changePasswordRequestDto: ChangePasswordRequestDto,
  ) {
    return this.userService.changePassword(changePasswordBodyDto, changePasswordRequestDto);
  }

  @Get('profile/:userId')
  async getUserProfile(
    @Param('userId', ParseIntPipe) userId: number
  ) {
    return this.userService.getUserProfile(userId);
  }

  @Get('profile/:userId/skills')
  async getUserSkills(
    @Param() getUsersSkillsParamsDto: GetUsersSkillsParamsDto,
    @Query() getUsersSkillsQueriesDto: GetUsersSkillsQueriesDto,

  ) {
    return this.userService.getUserSkills(getUsersSkillsParamsDto, getUsersSkillsQueriesDto);
  }


  @Get('profile/:userId/experiences')
  async getUserExperiences(
    @Param() getUsersExperienceParamsDto: GetUsersExperiencesParamsDto,
    @Query() GetUsersExperiencesQueriesDto: GetUsersExperiencesQueriesDto,

  ) {
    return this.userService.getUserExperiences(getUsersExperienceParamsDto, GetUsersExperiencesQueriesDto);
  }
}
