import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { Community } from 'src/schemas/community.schema';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly communityModel: Model<Community>,
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
  ) { }
  async createCommunity() {
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
