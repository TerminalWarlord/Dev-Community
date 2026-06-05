import { ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePostBodyDto, CreatePostRequestDto } from './dto/create-post.dto';
import { PostFilter, PostOrderBy, PostStatus } from 'src/common/post.enum';
import { GetPostsQueriesDto } from './dto/get-posts.dto';
import { GetPostParamsDto, GetPostQueriesDto } from './dto/get-post.dto';
import { UpdatePostBodyDto, UpdatePostParamsDto, UpdatePostRequestDto } from './dto/update-post.dto';
import { DeletePostBodyDto, DeletePostParamsDto, DeletePostRequestDto } from './dto/delete-post.dto';
import { castVoteOnPost, generatePostSlug, managePost, PostOperationType, schedulePost } from './post.helper';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from './dto/vote-post.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { FindOperator, FindOptionsOrder, FindOptionsOrderValue, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { formatDate } from 'src/common/format-date';
import { PostVote } from 'src/entities/post-vote.entity';
import { CommunityRole } from 'src/entities/community-role.entity';
import { User } from 'src/entities/user.entity';
import Redis from 'ioredis';



@Injectable()
export class PostService {
  private logger = new Logger()

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(PostVote)
    private readonly postVoteRepo: Repository<PostVote>,
    @InjectRepository(CommunityRole)
    private readonly communityRoleRepo: Repository<CommunityRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
      const communityId = getPostQueriesDto?.communityId ? parseInt(getPostQueriesDto.communityId) : undefined;
      const post = await this.postRepo.findOne({
        where: {
          community: {
            id: communityId
          },
          slug: getPostParamsDto.postSlug,
          status: PostStatus.PUBLISHED
        }
      });
      if (!post) {
        throw new NotFoundException("Couldn't find any post with that slug");
      }
      const views = await this.redisClient.incr(`post:${post.id}:views`);
      return {
        ...post,
        views
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to get post");
    }
  }

  async getAllPosts(
    getPostsQueriesDto: GetPostsQueriesDto,
  ) {
    try {
      const page = Math.max(parseInt(getPostsQueriesDto.page || "1"), 1);
      const limit = Math.min(parseInt(getPostsQueriesDto.limit || "10"), 10);
      const query = getPostsQueriesDto.query;
      const communityId = getPostsQueriesDto?.communityId ? parseInt(getPostsQueriesDto?.communityId) : undefined;
      const postedBy = getPostsQueriesDto?.profileId ? parseInt(getPostsQueriesDto?.profileId) : undefined;
      const postFilter = getPostsQueriesDto.filter || PostFilter.CREATED_AT;
      const postOrderBy = getPostsQueriesDto.orderBy || PostOrderBy.ASC;


      let postSortFilter: FindOptionsOrder<Post> = {};
      if (postFilter === PostFilter.CREATED_AT) {
        postSortFilter.createdAt = postOrderBy === PostOrderBy.ASC ? "ASC" : "DESC";
      }
      else if (postFilter === PostFilter.UPDATED_AT) {
        postSortFilter.updatedAt = postOrderBy === PostOrderBy.ASC ? "ASC" : "DESC";
      }
      else if (postFilter === PostFilter.POPULARITY) {
        postSortFilter.totalUpvotes = postOrderBy === PostOrderBy.ASC ? "ASC" : "DESC";
      }
      let postFilterQuery: FindOptionsWhere<Post> = {
        community: {
          id: communityId
        },
        status: PostStatus.PUBLISHED,
      }
      if (postedBy) {
        postFilterQuery.postedBy = {
          id: postedBy
        }
      }
      if (query) {
        postFilterQuery.title = ILike(`%${query}%`);
      }
      console.log(postFilterQuery)
      const offset = (page - 1) * limit;
      // const posts = await this.postModel.aggregate([
      //   {
      //     $match: postFilterQuery
      //   },
      //   {
      //     $addFields: {
      //       score: {
      //         $add: [
      //           { $multiply: [{ $ifNull: ["$totalUpvotes", 0], }, 1] },
      //           { $multiply: [{ $ifNull: ["$totalDownvotes", 0], }, -1] },
      //           { $multiply: [{ $ifNull: ["$totalComments", 0], }, 3] },
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "postedBy",
      //       foreignField: "_id",
      //       as: "user",
      //       pipeline: [
      //         {
      //           $project: {
      //             _id: 1,
      //             fname: 1,
      //             lname: 1
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $unset: [
      //       "__v",
      //       "postedBy",
      //     ]
      //   },
      //   {
      //     $sort: postSortFilter as Record<string, 1 | -1>
      //   },
      //   { $skip: offset },
      //   { $limit: limit + 1 }
      // ])
      const posts = await this.postRepo.find({
        where: postFilterQuery,
        order: postSortFilter,
        skip: offset,
        take: limit + 1
      })
      const results = posts.slice(0, limit);
      const updatedResults = await Promise.all(
        results.map(async (post) => {
          const views = parseInt(await this.redisClient.get(`post:${post.id}:views`) || "0");
          return { ...post, views }
        })
      )
      return {
        updatedResults,
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

  async createPost(
    createPostBodyDto: CreatePostBodyDto,
    createPostRequestDto: CreatePostRequestDto
  ) {
    try {
      const slug = await generatePostSlug(createPostBodyDto.title, this.postRepo);
      const communityId = createPostBodyDto.communityId ? parseInt(createPostBodyDto.communityId) : undefined;
      // TODO: make sure used can't post with past publishAt
      // TODO: fix off by 6hrs issue
      const publishAt = createPostBodyDto?.publishAt ? new Date(createPostBodyDto?.publishAt.replace("Z", "") + "+06:00") : new Date();
      const postStatus = new Date().getTime() < (new Date(publishAt)).getTime() ? PostStatus.SCHEDULED : PostStatus.PUBLISHED;

      this.logger.log(publishAt)
      const post = await this.postRepo.save(this.postRepo.create({
        slug,
        publishAt,
        community: {
          id: communityId
        },
        content: createPostBodyDto.content,
        title: createPostBodyDto.title,
        status: postStatus,
        postedBy: {
          id: createPostRequestDto.userId
        },
      }));
      console.log(publishAt.getTime())
      console.log(Date.now())
      // TODO: fix post scheduling
      if (postStatus === PostStatus.SCHEDULED) {
        const delay = new Date(publishAt).getTime() - Date.now();
        // console.log(new Date(publishAt), new Date(Date.now()), delay)
        await schedulePost(
          post.id.toString(),
          this.postQueue,
          delay
        );
      }
      return {
        message: "success",
        slug,
        postId: post.id,
        title: createPostBodyDto.title,
        content: createPostBodyDto.content,
        status: postStatus,
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException("Failed to create post");
    }
  }

  async updatePost(
    updatePostBodyDto: UpdatePostBodyDto,
    updatePostParamsDto: UpdatePostParamsDto,
    updatePostRequestDto: UpdatePostRequestDto,
  ) {
    try {
      const communityId = updatePostBodyDto.communityId ? parseInt(updatePostBodyDto.communityId) : undefined;
      await managePost(
        updatePostParamsDto.postSlug,
        this.postRepo,
        this.communityRoleRepo,
        this.userRepo,
        updatePostRequestDto.userId,
        PostOperationType.UPDATE,
        communityId,
        updatePostBodyDto
      )
      return {
        message: "message"
      }
    }
    catch (err) {
      this.logger.log(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to update post");
    }
  }

  async deletePost(
    deletePostBodyDto: DeletePostBodyDto,
    deletePostParamsDto: DeletePostParamsDto,
    deletePostRequestDto: DeletePostRequestDto,
  ) {
    try {
      const communityId = deletePostBodyDto?.communityId ? parseInt(deletePostBodyDto?.communityId) : undefined;
      await managePost(
        deletePostParamsDto.postSlug,
        this.postRepo,
        this.communityRoleRepo,
        this.userRepo,
        deletePostRequestDto.userId,
        PostOperationType.DELETION,
        communityId
      )
      return {
        message: "message"
      }
    }
    catch (err) {
      this.logger.error(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to delete post");
    }
  }

  async votePost(
    votePostBodyDto: VotePostBodyDto,
    votePostParamsDto: VotePostParamsDto,
    votePostRequestDto: VotePostRequestDto
  ) {
    try {
      const { communityId } = votePostBodyDto;
      const DISLIKE_THRESHOLD = this.configService.get<number>('DISLIKE_THRESHOLD') || 10;
      await castVoteOnPost(
        votePostRequestDto.userId,
        votePostParamsDto.postSlug,
        votePostBodyDto?.voteType,
        this.postVoteRepo,
        this.postRepo,
        this.userRepo,
        this.mailService,
        communityId,
        DISLIKE_THRESHOLD
      );
      return {
        message: "success"
      }
    } catch (err) {
      // console.log(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to cast vote");

    }
  }
}
