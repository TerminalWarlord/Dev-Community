import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('community/:communityId/post')
export class PostController {
  constructor(private postService: PostService) { }
  @Post('create')
  async createCommunityPost() {
  }

  @Patch('update')
  async updateCommunityPost() {
  }

  @Post('vote')
  async voteCommunityPost() {
  }


  @Delete('delete')
  async deleteCommunityPost() {
  }


  @Get(':postSlug/comment/all')
  async getCommunityPostComments() {
  }

  @Post(':postSlug/comment/add')
  async addACommunityPostComment() {
  }

  @Patch(':postSlug/comment/update')
  async updateACommunityPostComment() {
  }

  @Delete(':postSlug/comment/update')
  async deleteACommunityPostComment() {
  }
}
