import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { GetUsersSkillsParamsDto, GetUsersSkillsQueriesDto } from './dto/get-users-skills.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: { userId: string },
  ) {
    return this.userService.changePassword(changePasswordDto, req.userId);
  }

  @Get('profile/:userId')
  async getUserProfile(
    @Param('userId') userId: string
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

  @Post('invitation/accept/:invitationId')
  async acceptInvitation() {
    return this.userService.acceptInvitation();
  }

  @Post('invitation/reject/:invitationId')
  async rejectInvitation() {
    return this.userService.rejectInvitation();
  }
}
