import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from './dto/update-community.dto';
import { DeleteCommunityParamsDto, DeleteCommunityRequestDto } from './dto/delete-community.dto';
import { GetCommunitiesQueriesDto } from './dto/get-all-communities.dto';
import { GetCommunityMembersParamsDto, GetCommunityMembersQueriesDto } from './dto/get-community-members.dto';
import { BanACommunityMemberParamsDto, BanACommunityMemberRequestDto } from './dto/ban-community-member.dto';
import { JoinCommunityParamsDto, JoinCommunityRequestDto } from './dto/join-community.dto';
import { InviteModeratorParamsDto } from './dto/invite-moderator.dto';
import { CommunityAdminAuthGuard } from './common/admin.guard';
import { ManageInvitationParamsDto, ManageInvitationRequestDto } from './dto/manage-invitation.dto';
import { CommunityModeratorAuthGuard } from './common/moderator.guard';

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

  @UseGuards(AuthGuard)
  @UseGuards(CommunityAdminAuthGuard)
  @Post(':communityId/invite/:userId')
  async inviteModerator(
    @Param() inviteModeratorParamsDto: InviteModeratorParamsDto,
  ) {
    return this.communityService.inviteModerator(
      inviteModeratorParamsDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':communityId/invite/accept/:invitationId')
  async acceptModeratorInvitation(
    @Param() manageInvitationParamsDto: ManageInvitationParamsDto,
    @Request() manageInvitationRequestDto: ManageInvitationRequestDto,
  ) {
    return this.communityService.acceptModeratorInvitation(
      manageInvitationParamsDto,
      manageInvitationRequestDto
    );
  }
}
