import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostBodyDto, CreatePostParamsDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostStatus } from 'src/common/post.enum';
import { GetPostsParamsDto, GetPostsQueriesDto } from './dto/get-posts.dto';

@Injectable()
export class PostService {
  private logger = new Logger()
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) { }

  async getPost() {
  }

  async getAllPosts(
    getPostsQueriesDto: GetPostsQueriesDto,
    getPostsParamsDto: GetPostsParamsDto,
  ) {
    try {
      const page = getPostsQueriesDto.page || 1;
      const limit = getPostsQueriesDto.limit || 10;
      const offset = (page - 1) * limit;
      const posts = await this.postModel.find({
        communityId: getPostsParamsDto.communityId
      })
        .skip(offset)
        .limit(limit + 1);
      const results = posts.slice(0, limit);
      return {
        results,
        hasNextPage: posts.length > limit,
      }
    } catch (err) {
      throw new InternalServerErrorException("Failed to get posts");
    }
  }

  async createCommunityPost(
    createPostBodyDto: CreatePostBodyDto,
    createPostParamsDto: CreatePostParamsDto,
    createPostRequestDto: CreatePostRequestDto
  ) {
    try {
      const post = await this.postModel.insertOne({
        title: createPostBodyDto.title,
        slug: createPostBodyDto.slug,
        content: createPostBodyDto.content,
        status: PostStatus.PUBLISHED,
        communityId: createPostParamsDto.communityId,
        postedBy: createPostRequestDto.userId
      });
      return {
        message: "success",
        postId: post._id,
        title: createPostBodyDto.title,
        slug: createPostBodyDto.slug,
        content: createPostBodyDto.content,
        status: PostStatus.PUBLISHED,
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("Failed to create post");
    }
  }

  async updateCommunityPost() {
  }

  async voteCommunityPost() {
  }

  async deleteCommunityPost() {
  }
}
