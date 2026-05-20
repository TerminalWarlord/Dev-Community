import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostBodyDto, CreatePostParamsDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostStatus } from 'src/common/post.enum';

@Injectable()
export class PostService {
  private logger = new Logger()
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) { }

  async getPost() {
  }

  async getAllPosts() {
  }

  // TODO: add a guard to check if user is a member of a community
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
