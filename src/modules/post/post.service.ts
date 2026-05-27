import { ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage, SortOrder } from 'mongoose';
import { Post } from 'src/schemas/post.schema';
import { CreatePostBodyDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostFilter, PostOrderBy, PostStatus, VoteType } from 'src/common/post.enum';
import { GetPostsQueriesDto, GetPostsRequestDto } from './dto/get-posts.dto';
import { GetPostParamsDto, GetPostQueriesDto } from './dto/get-post.dto';
import { UpdatePostBodyDto, UpdatePostParamsDto, UpdatePostRequestDto } from './dto/update-post.dto';
import { DeletePostBodyDto, DeletePostParamsDto, DeletePostRequestDto } from './dto/delete-post.dto';
import { castVoteOnPost, generatePostSlug, managePost, PostOperationType, schedulePost } from './post.helper';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { User } from 'src/schemas/user.schema';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from './dto/vote-post.dto';
import { PostVote } from 'src/schemas/post-votes.schema';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';


interface PostFilterQueryType {
  communityId?: mongoose.Types.ObjectId,
  status: PostStatus,
  title?: object,
  postedBy?: mongoose.Types.ObjectId
}
type PostSortFilterType = Record<string, number>;

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
    @InjectQueue('posts')
    private postQueue: Queue,
    private mailService: MailService,
    private configService: ConfigService
  ) {
    this.logger.log("INITIALIZING post service")
  }

  async getPost(
    getPostQueriesDto: GetPostQueriesDto,
    getPostParamsDto: GetPostParamsDto
  ) {
    this.logger.log(getPostQueriesDto, getPostParamsDto)
    try {
      const communityId = getPostQueriesDto.communityId ? new mongoose.Types.ObjectId(getPostQueriesDto.communityId) : undefined;
      // TODO: get post votes
      const post = await this.postModel.findOne({
        communityId,
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
    getPostsRequestDto: GetPostsRequestDto
  ) {
    try {
      const page = Math.max(parseInt(getPostsQueriesDto.page || "1"), 1);
      const limit = Math.min(parseInt(getPostsQueriesDto.limit || "10"), 10);
      const query = getPostsQueriesDto.query;
      const communityId = getPostsQueriesDto?.communityId ? new mongoose.Types.ObjectId(getPostsQueriesDto?.communityId) : undefined;
      const userId = getPostsRequestDto?.userId ? new mongoose.Types.ObjectId(getPostsRequestDto?.userId) : undefined;
      const postedBy = getPostsQueriesDto?.profileId ? new mongoose.Types.ObjectId(getPostsQueriesDto?.profileId) : undefined;
      const postFilter = getPostsQueriesDto.filter || PostFilter.CREATED_AT;
      const postOrderBy = getPostsQueriesDto.orderBy || PostOrderBy.ASC;


      let postSortFilter: PostSortFilterType = {};
      if (postFilter === PostFilter.CREATED_AT) {
        postSortFilter.createdAt = postOrderBy === PostOrderBy.ASC ? 1 : -1;
      }
      else if (postFilter === PostFilter.UPDATED_AT) {
        postSortFilter.updatedAt = postOrderBy === PostOrderBy.ASC ? 1 : -1;
      }
      else if (postFilter === PostFilter.POPULARITY) {
        postSortFilter.score = postOrderBy === PostOrderBy.ASC ? 1 : -1;
      }
      let postFilterQuery: PostFilterQueryType = {
        communityId,
        status: PostStatus.PUBLISHED,
      }
      if (postedBy) {
        postFilterQuery.postedBy = postedBy
      }
      if (query) {
        postFilterQuery.title = {
          $regex: query,
          $options: "i"
        }
      }
      const offset = (page - 1) * limit;
      const posts = await this.postModel.aggregate([
        {
          $match: postFilterQuery
        },
        {
          $addFields: {
            score: {
              $add: [
                { $multiply: [{ $ifNull: ["$totalUpvotes", 0], }, 1] },
                { $multiply: [{ $ifNull: ["$totalDownvotes", 0], }, -1] },
                { $multiply: [{ $ifNull: ["$totalComments", 0], }, 3] },
              ]
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  fname: 1,
                  lname: 1
                }
              }
            ]
          }
        },
        {
          $unset: [
            "__v",
            "postedBy",
          ]
        },
        {
          $sort: postSortFilter as Record<string, 1 | -1>
        },
        { $skip: offset },
        { $limit: limit + 1 }
      ])
      const results = posts.slice(0, limit);
      return {
        results,
        hasNextPage: posts.length > limit,
      }
    } catch (err) {
      this.logger.error(err);
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
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
      // TODO: make sure used can't post with past publishAt
      // TODO: fix off by 6hrs issue
      const publishAt = new Date(createPostBodyDto?.publishAt || Date.now());
      const postStatus = new Date().getTime() < publishAt.getTime() ? PostStatus.SCHEDULED : PostStatus.PUBLISHED;
      const post = await this.postModel.insertOne({
        slug,
        communityId,
        title: createPostBodyDto.title,
        content: createPostBodyDto.content,
        status: postStatus,
        postedBy: new mongoose.Types.ObjectId(createPostRequestDto.userId),
        publishAt
      });
      console.log(publishAt.getTime())
      console.log(Date.now())
      if (postStatus === PostStatus.SCHEDULED) {
        const delay = new Date(publishAt).getTime() - Date.now();
        console.log(new Date(publishAt), new Date(Date.now()), delay)
        await schedulePost(
          post._id.toString(),
          this.postQueue,
          delay
        );
      }
      return {
        message: "success",
        slug,
        postId: post._id,
        title: createPostBodyDto.title,
        content: createPostBodyDto.content,
        status: postStatus,
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
    deletePostBodyDto: DeletePostBodyDto,
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
        deletePostBodyDto?.communityId
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
      const communityId = votePostBodyDto?.communityId ? new mongoose.Types.ObjectId(votePostBodyDto?.communityId) : undefined;
      const DISLIKE_THRESHOLD = this.configService.get<number>('DISLIKE_THRESHOLD') || 10;
      await castVoteOnPost(
        votePostRequestDto.userId,
        votePostParamsDto.postSlug,
        votePostBodyDto?.voteType,
        this.postVoteModel,
        this.postModel,
        this.userModel,
        this.mailService,
        communityId,
        DISLIKE_THRESHOLD
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
