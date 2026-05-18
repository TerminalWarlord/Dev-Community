import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from './dto/update-community.dto';

@Controller('community')
export class CommunityController {
  constructor(
    private communityService: CommunityService
  ) { }
  @UseGuards(AuthGuard)
  @Post('create')
  async createCommunity(
    @Body() createCommunityBodyDto: CreateCommunityBodyDto,
    @Request() createCommunityRequestDto: CreateCommunityRequestDto,
  ) {
    return this.communityService.createCommunity(createCommunityBodyDto, createCommunityRequestDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':communityId/update')
  async updateCommunity(
    @Body() updateCommunityBodyDto: UpdateCommunityBodyDto,
    @Param() updateCommunityParamsDto: UpdateCommunityParamsDto,
    @Request() updateCommunityRequestDto: UpdateCommunityRequestDto,
  ) {
    return this.communityService.updateCommunity(
      updateCommunityBodyDto,
      updateCommunityParamsDto,
      updateCommunityRequestDto
    );
  }

  @Delete(':communityId/delete')
  async deleteCommunity() {
    return this.communityService.deleteCommunity();
  }

  @Post(':communityId/post/create')
  async createCommunityPost() {
    return this.communityService.createCommunityPost();
  }

  @Patch(':communityId/post/:postId/update')
  async updateCommunityPost() {
    return this.communityService.updateCommunityPost();
  }

  @Post(':communityId/post/:postId/vote')
  async voteCommunityPost() {
    return this.communityService.voteCommunityPost();
  }


  @Delete(':communityId/post/:postId/delete')
  async deleteCommunityPost() {
    return this.communityService.deleteCommunityPost();
  }

  @Delete(':communityId/user/:userId/ban')
  async banACommunityMember() {
    return this.communityService.banACommunityMember();
  }

  @Get(':communityId/post/:postId/comment/all')
  async getCommunityPostComments() {
    return this.communityService.getCommunityPostComments();
  }

  @Post(':communityId/post/:postId/comment/add')
  async addACommunityPostComment() {
    return this.communityService.addACommunityPostComment();
  }

  @Patch(':communityId/post/:postId/comment/update')
  async updateACommunityPostComment() {
    return this.communityService.updateACommunityPostComment();
  }

  @Delete(':communityId/post/:postId/comment/update')
  async deleteACommunityPostComment() {
    return this.communityService.deleteACommunityPostComment();
  }
}
