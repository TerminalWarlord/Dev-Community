import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostBodyDto, CreatePostRequestDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { GetPostsQueriesDto, GetPostsRequestDto } from './dto/get-posts.dto';
import { GetPostParamsDto } from './dto/get-post.dto';
import { UpdatePostBodyDto, UpdatePostParamsDto, UpdatePostRequestDto } from './dto/update-post.dto';
import { DeletePostBodyDto, DeletePostParamsDto, DeletePostRequestDto } from './dto/delete-post.dto';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from './dto/vote-post.dto';
import { CommunityMembershipAuthGuard } from '../community/common/member.guard';
import { OptionalReadAccessGuard } from '../community/common/optional-read.guard';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) { }

  @UseGuards(OptionalReadAccessGuard)
  @Get('all')
  async getAllPosts(
    @Query() getPostsQueriesDto: GetPostsQueriesDto,
    @Request() getPostsRequestDto: GetPostsRequestDto
  ) {
    return this.postService.getAllPosts(
      getPostsQueriesDto,
      getPostsRequestDto
    )
  }
  @Get(":postSlug")
  async getPost(
    @Param() getPostParamsDto: GetPostParamsDto
  ) {
    return this.postService.getPost(getPostParamsDto);
  }


  @UseGuards(AuthGuard)
  @UseGuards(CommunityMembershipAuthGuard)
  @Post('create')
  async createCommunityPost(
    @Body() createPostBodyDto: CreatePostBodyDto,
    @Request() createPostRequestDto: CreatePostRequestDto
  ) {
    return this.postService.createCommunityPost(
      createPostBodyDto,
      createPostRequestDto
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(CommunityMembershipAuthGuard)
  @Patch(':postSlug/update')
  async updateCommunityPost(
    @Body() updatePostBodyDto: UpdatePostBodyDto,
    @Param() updatePostParamsDto: UpdatePostParamsDto,
    @Request() updatePostRequestDto: UpdatePostRequestDto,
  ) {
    return this.postService.updateCommunityPost(
      updatePostBodyDto,
      updatePostParamsDto,
      updatePostRequestDto
    )
  }

  @UseGuards(AuthGuard)
  @UseGuards(CommunityMembershipAuthGuard)
  @Delete(':postSlug/delete')
  async deleteCommunityPost(
    @Body() deletePostBodyDto: DeletePostBodyDto,
    @Param() deletePostParamsDto: DeletePostParamsDto,
    @Request() deletePostRequestDto: DeletePostRequestDto,
  ) {
    return this.postService.deleteCommunityPost(
      deletePostBodyDto,
      deletePostParamsDto,
      deletePostRequestDto
    )
  }


  @UseGuards(AuthGuard)
  @Post(':postSlug/vote')
  async voteCommunityPost(
    @Body() votePostBodyDto: VotePostBodyDto,
    @Param() votePostParamsDto: VotePostParamsDto,
    @Request() votePostRequestDto: VotePostRequestDto
  ) {
    return this.postService.voteCommunityPost(
      votePostBodyDto,
      votePostParamsDto,
      votePostRequestDto
    )
  }
}
