import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { CommunityStatus, MembershipStatus, Role } from 'src/common/community.enum';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from './dto/update-community.dto';
import { DeleteCommunityParamsDto, DeleteCommunityRequestDto } from './dto/delete-community.dto';
import { GetCommunitiesQueriesDto } from './dto/get-all-communities.dto';
import { generateSlug } from './community.helper';
import { GetCommunityMembersParamsDto, GetCommunityMembersQueriesDto } from './dto/get-community-members.dto';
import { BanACommunityMemberParamsDto, BanACommunityMemberRequestDto } from './dto/ban-community-member.dto';
import { JoinCommunityParamsDto, JoinCommunityRequestDto } from './dto/join-community.dto';
import { InviteModeratorParamsDto } from './dto/invite-moderator.dto';
import { ManageInvitationParamsDto, ManageInvitationRequestDto } from './dto/manage-invitation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, QueryFailedError, Repository } from 'typeorm';
import { Community } from 'src/entities/community.entity';
import { CommunityRole } from 'src/entities/community-role.entity';

@Injectable()
export class CommunityService {
  private logger = new Logger(CommunityService.name);
  constructor(
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(CommunityRole)
    private readonly communityRoleRepo: Repository<CommunityRole>,
  ) { }
  async getAllCommunities(getCommunitiesQueriesDto: GetCommunitiesQueriesDto) {
    const page = parseInt(getCommunitiesQueriesDto.page || "1");
    const limit = parseInt(getCommunitiesQueriesDto.limit || "10");
    const offset = (page - 1) * limit;
    const query = getCommunitiesQueriesDto.query;
    try {
      const filter: {
        name?: FindOperator<string>
      } = {};
      if (query) {
        filter.name = ILike(query)
      }
      const communities = await this.communityRepo.find({
        skip: offset,
        take: limit + 1,
        where: filter
      })

      const results = communities.slice(0, limit);
      return {
        results,
        hasNextPage: communities.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get communities");
    }
  }

  async createCommunity(
    createCommunityBodyDto: CreateCommunityBodyDto,
    createCommunityRequestDto: CreateCommunityRequestDto,
  ) {
    try {
      const slug = await generateSlug(createCommunityBodyDto.name, this.communityRepo);
      const newCommunity = await this.communityRepo.create({
        slug,
        ...createCommunityBodyDto,
      });
      const community = await this.communityRepo.save(newCommunity);
      const communityRole = this.communityRoleRepo.create({
        community: {
          id: community.id
        },
        role: Role.ADMIN,
        status: MembershipStatus.REGULAR,
        joinedAt: Date.now(),
        user: {
          id: createCommunityRequestDto.userId
        }
      });
      await this.communityRoleRepo.save(communityRole);

      return {
        message: "success",
        communityId: community.id,
        communitySlug: slug
      }
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException("Failed to create community");
    }
  }

  async updateCommunity(
    updateCommunityBodyDto: UpdateCommunityBodyDto,
    updateCommunityParamsDto: UpdateCommunityParamsDto,
    updateCommunityRequestDto: UpdateCommunityRequestDto,
  ) {
    const communityId = parseInt(updateCommunityParamsDto.communityId);
    try {
      const communityRole = await this.communityRoleRepo.findOne({
        where: {
          community: {
            id: communityId,
          },
          user: {
            id: updateCommunityRequestDto.userId
          }
        }
      });
      if (!communityRole || communityRole.role !== Role.ADMIN) {
        throw new UnauthorizedException("You can't perform this action");
      }
      const updatedData: {
        description?: string,
        name?: string,
      } = {};
      if (updateCommunityBodyDto.description) {
        updatedData.description = updateCommunityBodyDto.description;
      }
      if (updateCommunityBodyDto.name) {
        updatedData.name = updateCommunityBodyDto.name;
      }
      await this.communityRepo.update({
        id: communityId
      }, updatedData);
      return {
        message: "success"
      }
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException("Failed to update community");
    }
  }

  async deleteCommunity(
    deleteCommunityParamsDto: DeleteCommunityParamsDto,
    deleteCommunityRequestDto: DeleteCommunityRequestDto,
  ) {
    // try {
    //   const communityId = new mongoose.Types.ObjectId(deleteCommunityParamsDto.communityId);
    //   const userId = new mongoose.Types.ObjectId(deleteCommunityRequestDto.userId);
    //   const communityRole = await this.communityRoleModel.findOne({
    //     communityId,
    //     userId,
    //   });
    //   if (!communityRole || communityRole.role !== Role.ADMIN) {
    //     throw new UnauthorizedException("You can't perform this action");
    //   }
    //   await this.communityModel.findOneAndUpdate(communityId, {
    //     status: CommunityStatus.DELETED
    //   });
    //   return {
    //     message: "success"
    //   }

    // } catch (error) {
    //   this.logger.error(error);
    //   throw new InternalServerErrorException("Failed to delete community");

    // }
  }

  async getCommunityMembers(
    getCommunityMembersQueriesDto: GetCommunityMembersQueriesDto,
    getCommunityMembersParamsDto: GetCommunityMembersParamsDto
  ) {
    try {
      const page = getCommunityMembersQueriesDto.page || 1;
      const limit = getCommunityMembersQueriesDto.limit || 10;
      const offset = (page - 1) * limit;
      const members = await this.communityRoleRepo.find({
        where: {
          community: {
            id: parseInt(getCommunityMembersParamsDto.communityId)
          }
        },
        select: {
          id: false,
          user: {
            id: true,
            fname: true,
            lname: true
          }
        },
        skip: offset,
        take: limit + 1
      });
      const results = members.slice(0, limit);
      return {
        results,
        hasNextPage: members.length > limit
      }
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException("Failed to get community members");
    }
  }

  async banACommunityMember(
    banACommunityMemberParamsDto: BanACommunityMemberParamsDto,
    banACommunityMemberRequestDto: BanACommunityMemberRequestDto
  ) {
    // try {
    //   const userId = new mongoose.Types.ObjectId(banACommunityMemberRequestDto.userId);
    //   const memberId = new mongoose.Types.ObjectId(banACommunityMemberParamsDto.memberId);
    //   const communityId = new mongoose.Types.ObjectId(banACommunityMemberParamsDto.communityId);
    //   const communityRole = await this.communityRoleModel.findOneAndUpdate({
    //     userId: memberId,
    //     communityId: communityId
    //   }, {
    //     role: "BANNED"
    //   });
    //   if (!communityRole) {
    //     throw new InternalServerErrorException("Failed to ban user");
    //   }
    //   return {
    //     message: "success",
    //   }

    // } catch (error) {
    //   this.logger.error(error);
    //   throw new InternalServerErrorException("Failed to ban user");
    // }
  }

  async joinCommunity(
    joinCommunityParamsDto: JoinCommunityParamsDto,
    joinCommunityRequestDto: JoinCommunityRequestDto
  ) {
    try {
      const userId = joinCommunityRequestDto.userId;
      const communityId = parseInt(joinCommunityParamsDto.communityId);
      // check if community exists
      const community = await this.communityRepo.findOne({
        where: {
          id: communityId
        }
      });
      if (!community) {
        throw new BadRequestException("Community doesn't exist");
      }
      const communityRole = this.communityRoleRepo.create({
        user: {
          id: userId
        },
        community: {
          id: communityId
        },
        joinedAt: new Date(Date.now())
      });
      await this.communityRoleRepo.save(communityRole);
      return {
        message: "success",
      }
    } catch (err) {
      this.logger.error(err)
      if (err instanceof QueryFailedError && err.driverError.code === '23505') {
        throw new BadRequestException("Seems like you have already joined the community")
      }
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException("Failed to join community");
    }
  }

  async inviteModerator(
    inviteModeratorParamsDto: InviteModeratorParamsDto,
  ) {
    // const userId = new mongoose.Types.ObjectId(inviteModeratorParamsDto.userId);
    // const communityId = new mongoose.Types.ObjectId(inviteModeratorParamsDto.communityId);
    // try {
    //   const communityRole = await this.communityRoleModel.findOneAndUpdate({
    //     userId,
    //     communityId
    //   }, {
    //     status: "INVITED"
    //   });

    //   if (!communityRole) {
    //     throw new InternalServerErrorException("User is not a member of the community");
    //   }
    //   return {
    //     message: "success",
    //     invitationUrl: `/community/${communityId}/invite/accept/${communityRole._id}`
    //   }

    // } catch (error) {
    //   if (error instanceof Error) {
    //     throw new InternalServerErrorException(error.message);
    //   }
    //   this.logger.error(error);
    //   throw new InternalServerErrorException("Failed to invite user");
    // }
  }

  async acceptModeratorInvitation(
    manageInvitationParamsDto: ManageInvitationParamsDto,
    manageInvitationRequestDto: ManageInvitationRequestDto,
  ) {
    // try {
    //   const invitationId = new mongoose.Types.ObjectId(manageInvitationParamsDto.invitationId);
    //   const communityId = new mongoose.Types.ObjectId(manageInvitationParamsDto.communityId);
    //   const userId = new mongoose.Types.ObjectId(manageInvitationRequestDto.userId);
    //   const communityRole = await this.communityRoleModel.findOne({
    //     communityId,
    //     userId,
    //     _id: invitationId,
    //   });
    //   if (!communityRole || communityRole.status !== "INVITED") {
    //     throw new ForbiddenException("Doesn't seem like you have any open invitation");
    //   }
    //   const updatedCommunityRole = await this.communityRoleModel.findOneAndUpdate({
    //     userId,
    //     communityId,
    //     _id: invitationId,
    //   }, {
    //     role: "MODERATOR",
    //     status: "REGULAR",
    //   });
    //   if (!updatedCommunityRole) {
    //     throw new InternalServerErrorException("Failed to update user role");
    //   }
    //   return {
    //     message: "success"
    //   }
    // } catch (error) {
    //   if (error instanceof ForbiddenException) {
    //     throw new ForbiddenException(error.message);
    //   }
    //   else if (error instanceof InternalServerErrorException) {
    //     throw new InternalServerErrorException(error.message);
    //   }
    //   throw new InternalServerErrorException("Failed to accept invitation");
    // }
  }
}
