import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostBodyDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostStatus, VoteType } from 'src/common/post.enum';
import { GetPostsParamsDto, GetPostsQueriesDto } from './dto/get-posts.dto';
import { GetPostParamsDto } from './dto/get-post.dto';
import { UpdatePostBodyDto, UpdatePostParamsDto, UpdatePostRequestDto } from './dto/update-post.dto';
import { DeletePostParamsDto, DeletePostRequestDto } from './dto/delete-post.dto';
import { castVote, generatePostSlug, managePost, PostOperationType } from './post.helper';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { User } from 'src/schemas/user.schema';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from './dto/vote-post.dto';
import { PostVote } from 'src/schemas/post-votes.schema';


@Injectable()
export class PostService {
  private logger = new Logger()
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(PostVote.name)
    private readonly postVoteModel: Model<PostVote>,
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async getPost(
    getPostParamsDto: GetPostParamsDto
  ) {
    try {
      // TODO: get post votes
      const post = await this.postModel.findOne({
        slug: getPostParamsDto.postSlug,
        status: PostStatus.PUBLISHED
      })
        .select("-__v -status -communityId")
        .populate("postedBy", "_id fname lname")
        .lean();
      if (!post) {
        throw new NotFoundException("Couldn't find any post with that slug");
      }

      // TODO: use aggregation
      // const postVotes = await this.postVoteModel.aggregate([
      //   { $match: { postId: post._id } },
      //   {
      //     $group: { _id: "$voteType", upvotes: {$sum: "$UPVOTE"}}
      //   }
      // ]);
      const upvotes = await this.postVoteModel.countDocuments({
        postId: post._id,
        voteType: VoteType.UPVOTE
      });
      const downvotes = await this.postVoteModel.countDocuments({
        postId: post._id,
        voteType: VoteType.DOWNVOTE
      });
      const neutralVotes = await this.postVoteModel.countDocuments({
        postId: post._id,
        voteType: VoteType.NEUTRAL
      });
      return {
        ...post,
        upvotes,
        downvotes,
        neutralVotes
      };
    } catch (err) {
      this.logger.error(err);
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
      const query = getPostsQueriesDto.query;

      let postFilter: {
        communityId: mongoose.Types.ObjectId,
        status: PostStatus,
        title?: object
      } = {
        communityId: new mongoose.Types.ObjectId(getPostsParamsDto.communityId),
        status: PostStatus.PUBLISHED
      }
      if (query) {
        postFilter = {
          ...postFilter,
          title: {
            $regex: query,
            $options: "i"
          },
        }
      }
      const offset = (page - 1) * limit;
      const posts = await this.postModel.find(postFilter)
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
    createPostRequestDto: CreatePostRequestDto
  ) {
    try {
      const slug = await generatePostSlug(createPostBodyDto.title, this.postModel);
      const communityId = createPostBodyDto.communityId ? new mongoose.Types.ObjectId(createPostBodyDto.communityId) : undefined;
      const post = await this.postModel.insertOne({
        slug,
        communityId,
        title: createPostBodyDto.title,
        content: createPostBodyDto.content,
        status: PostStatus.PUBLISHED,
        postedBy: new mongoose.Types.ObjectId(createPostRequestDto.userId),
      });
      return {
        message: "success",
        slug,
        postId: post._id,
        title: createPostBodyDto.title,
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
      await managePost(
        updatePostParamsDto.postSlug,
        this.postModel,
        this.communityRoleModel,
        this.userModel,
        updatePostRequestDto.userId,
        PostOperationType.UPDATE,
        updatePostBodyDto.communityId,
        updatePostBodyDto
      )
      return {
        message: "message"
      }
    }
    catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to update post");
    }
  }

  async deleteCommunityPost(
    deletePostParamsDto: DeletePostParamsDto,
    deletePostRequestDto: DeletePostRequestDto,
  ) {
    try {
      await managePost(
        deletePostParamsDto.postSlug,
        this.postModel,
        this.communityRoleModel,
        this.userModel,
        deletePostRequestDto.userId,
        PostOperationType.DELETION,
        deletePostParamsDto.communityId
      )
      return {
        message: "message"
      }
    }
    catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to delete post");
    }
  }

  async voteCommunityPost(
    votePostBodyDto: VotePostBodyDto,
    votePostParamsDto: VotePostParamsDto,
    votePostRequestDto: VotePostRequestDto
  ) {
    try {
      await castVote(
        votePostRequestDto.userId,
        votePostParamsDto.postSlug,
        votePostBodyDto?.voteType,
        this.postVoteModel,
        this.postModel
      );
      return {
        message: "success"
      }
    } catch (err) {
      console.log(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to cast vote");

    }
  }

}
