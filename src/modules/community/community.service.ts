import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { Community } from 'src/schemas/community.schema';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { MembershipStatus, Role } from 'src/common/community.enum';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from './dto/update-community.dto';
import { DeleteCommunityParamsDto, DeleteCommunityRequestDto } from './dto/delete-community.dto';
import { GetCommunitiesQueriesDto } from './dto/get-all-communities.dto';
import { generateSlug } from './community.helper';
import { GetCommunityMembersParamsDto, GetCommunityMembersQueriesDto } from './dto/get-community-members.dto';
import { BanACommunityMemberParamsDto, BanACommunityMemberRequestDto } from './dto/ban-community-member.dto';
import { JoinCommunityParamsDto, JoinCommunityRequestDto } from './dto/join-community.dto';
import { InviteModeratorParamsDto } from './dto/invite-moderator.dto';
import { PORT } from 'src/common/constants';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<Community>,
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
  ) { }
  async getAllCommunities(getCommunitiesQueriesDto: GetCommunitiesQueriesDto) {
    const page = getCommunitiesQueriesDto.page || 1;
    const limit = getCommunitiesQueriesDto.limit || 1;
    const offset = (page - 1) * limit;
    const query = getCommunitiesQueriesDto.query;
    try {
      // Add query
      let filter = {};
      if (query) {
        filter = {
          name: {
            $regex: getCommunitiesQueriesDto.query
          }
        }
      }
      const communities = await this.communityModel.find(filter)
        .skip(offset)
        .limit(limit + 1);
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
      const slug = await generateSlug(createCommunityBodyDto.name, this.communityModel);
      const community = await this.communityModel.insertOne({
        slug,
        ...createCommunityBodyDto,

      });
      const communityRole = await this.communityRoleModel.insertOne({
        communityId: new mongoose.Types.ObjectId(community._id),
        role: Role.ADMIN,
        status: MembershipStatus.REGULAR,
        userId: new mongoose.Types.ObjectId(createCommunityRequestDto.userId)
      });

      return {
        message: "success",
        communityId: community._id,
        communitySlug: slug
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to create community");
    }
  }

  async updateCommunity(
    updateCommunityBodyDto: UpdateCommunityBodyDto,
    updateCommunityParamsDto: UpdateCommunityParamsDto,
    updateCommunityRequestDto: UpdateCommunityRequestDto,
  ) {
    try {
      const communityRole = await this.communityRoleModel.findOne({
        communityId: new mongoose.Types.ObjectId(updateCommunityParamsDto.communityId),
        userId: new mongoose.Types.ObjectId(updateCommunityRequestDto.userId)
      });
      if (!communityRole || communityRole.role !== Role.ADMIN) {
        throw new UnauthorizedException("You can't perform this action");
      }
      const community = await this.communityModel.updateOne({
        _id: updateCommunityParamsDto.communityId,
      }, updateCommunityBodyDto);
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
    // TODO: add communityId+userId index on CommunityRole schema
    // TODO: add better error handling
    try {
      const communityId = new mongoose.Types.ObjectId(deleteCommunityParamsDto.communityId);
      const userId = new mongoose.Types.ObjectId(deleteCommunityRequestDto.userId);
      const communityRole = await this.communityRoleModel.findOne({
        communityId,
        userId,
      });
      if (!communityRole || communityRole.role !== Role.ADMIN) {
        throw new UnauthorizedException("You can't perform this action");
      }
      await this.communityModel.findByIdAndDelete(communityId);
      await this.communityRoleModel.deleteMany({
        communityId
      });

      return {
        message: "success"
      }

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Failed to delete community");

    }
  }

  async getCommunityMembers(
    getCommunityMembersQueriesDto: GetCommunityMembersQueriesDto,
    getCommunityMembersParamsDto: GetCommunityMembersParamsDto
  ) {
    try {
      const page = getCommunityMembersQueriesDto.page || 1;
      const limit = getCommunityMembersQueriesDto.limit || 10;
      const offset = (page - 1) * limit;
      const members = await this.communityRoleModel.find({
        communityId: new mongoose.Types.ObjectId(getCommunityMembersParamsDto.communityId)
      })
        .populate("userId", "-password -createdAt -updatedAt -__v -email")
        .select("-_id -__v -createdAt -updatedAt -communityId")
        .skip(offset)
        .limit(limit + 1);
      const results = members.slice(0, limit);
      return {
        results,
        hasNextPage: members.length > limit
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Failed to get community members");
    }
  }

  async banACommunityMember(
    banACommunityMemberParamsDto: BanACommunityMemberParamsDto,
    banACommunityMemberRequestDto: BanACommunityMemberRequestDto
  ) {
    try {
      const userId = new mongoose.Types.ObjectId(banACommunityMemberRequestDto.userId);
      const memberId = new mongoose.Types.ObjectId(banACommunityMemberParamsDto.memberId);
      const communityId = new mongoose.Types.ObjectId(banACommunityMemberParamsDto.communityId);
      const communityRole = await this.communityRoleModel.findOneAndUpdate({
        userId: memberId,
        communityId: communityId
      }, {
        role: "BANNED"
      });
      if (!communityRole) {
        throw new InternalServerErrorException("Failed to ban user");
      }
      return {
        message: "success",
      }

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Failed to ban user");
    }
  }

  async joinCommunity(
    joinCommunityParamsDto: JoinCommunityParamsDto,
    joinCommunityRequestDto: JoinCommunityRequestDto
  ) {
    try {
      const userId = new mongoose.Types.ObjectId(joinCommunityRequestDto.userId);
      const communityId = new mongoose.Types.ObjectId(joinCommunityParamsDto.communityId);
      // check if community exists
      const community = await this.communityModel.findById(communityId);
      if (!community) {
        throw new BadRequestException("Community doesn't exist");
      }
      await this.communityRoleModel.insertOne({
        userId,
        communityId
      })
      return {
        message: "success",
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException("Failed to join community");
    }
  }

  async inviteModerator(
    inviteModeratorParamsDto: InviteModeratorParamsDto,
  ) {
    const userId = new mongoose.Types.ObjectId(inviteModeratorParamsDto.userId);
    const communityId = new mongoose.Types.ObjectId(inviteModeratorParamsDto.communityId);
    try {
      const communityRole = await this.communityRoleModel.findOneAndUpdate({
        userId,
        communityId
      }, {
        status: "INVITED"
      });

      if (!communityRole) {
        throw new InternalServerErrorException("User is not a member of the community");
      }
      return {
        message: "success",
        invitationUrl: `http://localhost:${PORT}/community/${communityId}/invite/accept/${communityRole._id}`
      }

    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(error.message);
      }
      console.log(error);
      throw new InternalServerErrorException("Failed to invite user");
    }
  }

  async createCommunityPost() {
  }

  async updateCommunityPost() {
  }

  async voteCommunityPost() {
  }


  async deleteCommunityPost() {
  }


  async getCommunityPostComments() {
  }

  async addACommunityPostComment() {
  }

  async updateACommunityPostComment() {
  }

  async deleteACommunityPostComment() {
  }
}
