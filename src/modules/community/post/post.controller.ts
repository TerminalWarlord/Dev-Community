import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostBodyDto, CreatePostParamsDto, CreatePostRequestDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CommunityMembershipAuthGuard } from '../common/member.guard';

@Controller('community/:communityId/post')
export class PostController {
  constructor(private postService: PostService) { }
  @Get(":postSlug")
  async getPost() {
  }

  @Get('all')
  async getAllPosts() {
  }

  @UseGuards(AuthGuard)
  @UseGuards(CommunityMembershipAuthGuard)
  @Post('create')
  async createCommunityPost(
    @Body() createPostBodyDto: CreatePostBodyDto,
    @Param() createPostParamsDto: CreatePostParamsDto,
    @Request() createPostRequestDto: CreatePostRequestDto
  ) {
    return this.postService.createCommunityPost(
      createPostBodyDto,
      createPostParamsDto,
      createPostRequestDto
    );
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

  @Delete(':postSlug/comment/delete')
  async deleteACommunityPostComment() {
  }
}
