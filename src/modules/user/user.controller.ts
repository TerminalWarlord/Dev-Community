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
import { GetUsersExperiencesParamsDto, GetUsersExperiencesQueriesDto } from './dto/get-users-experiences.dto';
import { AddUserPostDto, AddUserPostRequestDto } from './dto/add-user-post.dto';
import { GetUserPost } from './dto/get-user-post.dto';
import { GetUserPostsParamsDto, GetUserPostsQueriesDto } from './dto/get-user-posts.dto';
import { UpdateUserPostBodyDto, UpdateUserPostParamsDto, UpdateUserPostRequestDto } from './dto/update-user-post.dto';
import { DeleteUserPostParamsDto, DeleteUserPostRequestDto } from './dto/delete-user-post.dto';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from '../post/dto/vote-post.dto';

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


  @Get('profile/:userId/experiences')
  async getUserExperiences(
    @Param() getUsersExperienceParamsDto: GetUsersExperiencesParamsDto,
    @Query() GetUsersExperiencesQueriesDto: GetUsersExperiencesQueriesDto,

  ) {
    return this.userService.getUserExperiences(getUsersExperienceParamsDto, GetUsersExperiencesQueriesDto);
  }

  @UseGuards(AuthGuard)
  @Post('profile/:userId/post')
  async addUserPost(
    @Body() addUserPostDto: AddUserPostDto,
    @Request() addUserPostRequestDto: AddUserPostRequestDto,
  ) {
    return this.userService.addUserPost(
      addUserPostDto,
      addUserPostRequestDto
    )
  }

  @Get('profile/:userId/post/all')
  async getUserPosts(
    @Query() getUserPostsQueriesDto: GetUserPostsQueriesDto,
    @Param() getUserPostsParamsDto: GetUserPostsParamsDto
  ) {
    return this.userService.getUserPosts(
      getUserPostsQueriesDto,
      getUserPostsParamsDto
    )
  }

  @Get('profile/:userId/post/:postSlug')
  async getUserPost(
    @Param() getUserPost: GetUserPost
  ) {
    return this.userService.getUserPost(getUserPost);
  }



  @UseGuards(AuthGuard)
  @Patch('profile/:userId/post/:postSlug/update')
  async updateUserPost(
    @Body() updateUserPostBodyDto: UpdateUserPostBodyDto,
    @Param() updateUserPostParamsDto: UpdateUserPostParamsDto,
    @Request() updateUserPostRequestDto: UpdateUserPostRequestDto
  ) {
    return this.userService.updateUserPost(
      updateUserPostBodyDto,
      updateUserPostParamsDto,
      updateUserPostRequestDto
    );
  }

  @UseGuards(AuthGuard)
  @Delete('profile/:userId/post/:postSlug/delete')
  async deleteUserPost(
    @Param() deleteUserPostParamsDto: DeleteUserPostParamsDto,
    @Request() deleteUserPostRequestDto: DeleteUserPostRequestDto
  ) {
    return this.userService.deleteUserPost(
      deleteUserPostParamsDto,
      deleteUserPostRequestDto
    )
  }


  @UseGuards(AuthGuard)
  @Post('profile/:userId/post/:postSlug/vote')
  async voteUserPost(
    @Body() votePostBodyDto: VotePostBodyDto,
    @Param() votePostParamsDto: VotePostParamsDto,
    @Request() votePostRequestDto: VotePostRequestDto,
  ) {
    return this.userService.voteUserPost(
      votePostBodyDto,
      votePostParamsDto,
      votePostRequestDto
    )
  }
}
