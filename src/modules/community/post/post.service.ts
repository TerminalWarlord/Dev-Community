import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostBodyDto, CreatePostParamsDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostStatus } from 'src/common/post.enum';
import { GetPostsParamsDto, GetPostsQueriesDto } from './dto/get-posts.dto';
import { GetPostParamsDto } from './dto/get-post.dto';
import { UpdateCommunityBodyDto, UpdateCommunityParamsDto, UpdateCommunityRequestDto } from '../dto/update-community.dto';
import { UpdatePostBodyDto, UpdatePostParamsDto, UpdatePostRequestDto } from './dto/update-post.dto';


@Injectable()
export class PostService {
  private logger = new Logger()
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) { }

  async getPost(
    getPostParamsDto: GetPostParamsDto
  ) {
    try {
      const post = await this.postModel.findOne({
        slug: getPostParamsDto.postSlug
      })
        .select("-__v -status -_id -communityId")
        .populate("postedBy", "_id fname lname");
      if (!post) {
        throw new NotFoundException("Couldn't find any post with that slug");
      }
      return post;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to get post");
    }
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
        communityId: new mongoose.Types.ObjectId(getPostsParamsDto.communityId)
      })
        .select("-communityId -status -__v -_id")
        .populate("postedBy", "_id fname lname")
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
        communityId: new mongoose.Types.ObjectId(createPostParamsDto.communityId),
        postedBy: new mongoose.Types.ObjectId(createPostRequestDto.userId),
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

  async updateCommunityPost(
    updatePostBodyDto: UpdatePostBodyDto,
    updatePostParamsDto: UpdatePostParamsDto,
    updatePostRequestDto: UpdatePostRequestDto,
  ) {
    try {
      // check if post exists and user actually posted it
      const communityId = new mongoose.Types.ObjectId(updatePostParamsDto.communityId);
      const userId = new mongoose.Types.ObjectId(updatePostRequestDto.userId);
      const postSlug = updatePostParamsDto.postSlug;

      const post = await this.postModel.findOne({
        slug: updatePostParamsDto.postSlug,
        communityId,
      });
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      if (post.postedBy.toString() !== updatePostRequestDto.userId) {
        throw new ForbiddenException("You can't perform this action");
      }
      await this.postModel.updateOne({
        communityId,
        slug: postSlug,
        postedBy: userId
      }, updatePostBodyDto);
      return {
        message: "success"
      };
    } catch (err) {
      if (err instanceof ForbiddenException) throw new ForbiddenException(err.message);
      else if (err instanceof NotFoundException) throw new NotFoundException(err.message);
      throw new InternalServerErrorException("Failed to update post");
    }
  }

  async voteCommunityPost() {
  }

  async deleteCommunityPost() {
  }
}
