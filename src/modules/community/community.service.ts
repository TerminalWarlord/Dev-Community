import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { Community } from 'src/schemas/community.schema';
import { CreateCommunityBodyDto, CreateCommunityRequestDto } from './dto/create-community.dto';
import { MembershipStatus, Role } from 'src/common/community.enum';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<Community>,
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
  ) { }
  async createCommunity(
    createCommunityBodyDto: CreateCommunityBodyDto,
    createCommunityRequestDto: CreateCommunityRequestDto,
  ) {
    try {
      // TODO: generate a unique slug
      const community = await this.communityModel.insertOne(createCommunityBodyDto);
      const communityRole = await this.communityRoleModel.insertOne({
        communityId: new mongoose.Types.ObjectId(community._id),
        role: Role.ADMIN,
        status: MembershipStatus.REGULAR,
        userId: new mongoose.Types.ObjectId(createCommunityRequestDto.userId)
      });

      return {
        message: "success",
        communityId: community._id
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to create community");
    }
  }

  async updateCommunity() {
  }

  async deleteCommunity() {
  }

  async createCommunityPost() {
  }

  async updateCommunityPost() {
  }

  async voteCommunityPost() {
  }


  async deleteCommunityPost() {
  }

  async banACommunityMember() {
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
