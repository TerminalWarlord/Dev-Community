import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from './dto/update-community.dto';
import { DeleteCommunityParamsDto, DeleteCommunityRequestDto } from './dto/delete-community.dto';
import { GetCommunitiesQueriesDto } from './dto/get-all-communities.dto';
import { GetCommunityMembersParamsDto, GetCommunityMembersQueriesDto } from './dto/get-community-members.dto';
import { BanACommunityMemberParamsDto, BanACommunityMemberRequestDto } from './dto/ban-community-member.dto';
import { CommunityModeratorAuthGuard } from './common/moderator.guard';
import { JoinCommunityParamsDto, JoinCommunityRequestDto } from './dto/join-community.dto';

@Controller('community')
export class CommunityController {
  constructor(
    private communityService: CommunityService
  ) { }
  // TODO: get list of communities when user is admin
  // TODO: get list of communities when user is member
  // TODO: get list of members with their roles (with pagination)

  @Get('all')
  async getAllCommunities(
    @Query() getCommunitiesQueriesDto: GetCommunitiesQueriesDto
  ) {
    return this.communityService.getAllCommunities(getCommunitiesQueriesDto);
  }


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

  @UseGuards(AuthGuard)
  @Delete(':communityId/delete')
  async deleteCommunity(
    @Param() deleteCommunityParamsDto: DeleteCommunityParamsDto,
    @Request() deleteCommunityRequestDto: DeleteCommunityRequestDto,
  ) {
    return this.communityService.deleteCommunity(deleteCommunityParamsDto, deleteCommunityRequestDto);
  }

  @Get(':communityId/member/all')
  async getCommunityMembers(
    @Query() getCommunityMembersQueriesDto: GetCommunityMembersQueriesDto,
    @Param() getCommunityMembersParamsDto: GetCommunityMembersParamsDto
  ) {
    return this.communityService.getCommunityMembers(
      getCommunityMembersQueriesDto,
      getCommunityMembersParamsDto,
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(CommunityModeratorAuthGuard)
  @Post(':communityId/member/:memberId/ban')
  async banACommunityMember(
    @Param() banACommunityMemberParamsDto: BanACommunityMemberParamsDto,
    @Request() banACommunityMemberRequestDto: BanACommunityMemberRequestDto
  ) {
    return this.communityService.banACommunityMember(
      banACommunityMemberParamsDto,
      banACommunityMemberRequestDto
    );
  }

  @UseGuards(AuthGuard)
  @Post(':communityId/join')
  async joinCommunity(
    @Param() joinCommunityParamsDto: JoinCommunityParamsDto,
    @Request() joinCommunityRequestDto: JoinCommunityRequestDto
  ) {
    return this.communityService.joinCommunity(
      joinCommunityParamsDto,
      joinCommunityRequestDto
    )
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
