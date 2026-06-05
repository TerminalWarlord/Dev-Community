import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AddCommentBodyDto, AddCommentParamsDto, AddCommentRequestDto } from './dto/add-comment.dto';
import { PostStatus, VoteType } from 'src/common/post.enum';
import { GetCommentParamsDto } from './dto/get-comment.dto';
import { CommentOrderBy, CommentStatus } from 'src/common/comment.enum';
import { GetAllCommentsParamsDto, GetAllCommentsQueriesDto, GetAllCommentsRequestDto } from './dto/get-all-comments.dto';
import { GetNestedComments } from './comment.helper';
import { UpdateCommentBodyDto, UpdateCommentParamsDto, UpdateCommentRequestDto } from './dto/update-comment.dto';
import { DeleteCommentParamsDto, DeleteCommentRequestDto } from './dto/delete-comment.dto';
import { VoteCommentBodyDto, VoteCommentParamsDto, VoteCommentRequestDto } from './dto/vote-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { CommentVote } from 'src/entities/comment-vote.entity';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);
  constructor(
    // @InjectModel(Comment.name)
    // private readonly commentModel: Model<Comment>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(CommentVote)
    private readonly commentVoteRepo: Repository<CommentVote>
  ) { }

  async getComment(
    getCommentParamsDto: GetCommentParamsDto
  ) {
    try {
      const commentId = parseInt(getCommentParamsDto.commentId);
      const comment = await this.commentRepo.findOne({
        where: {
          id: commentId,
          status: CommentStatus.PUBLISHED
        },
        select: {
          id: true,
          content: true,
          post: {
            id: true
          },
          user: {
            id: true
          },
          totalUpvotes: true,
          totalDownvotes: true,
          totalVotes: true,
          createdAt: true,
        },
        relations: {
          user: true,
          post: true
        }
      });
      if (!comment) {
        throw new NotFoundException("Comment doesn't exist");
      }
      return comment;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to get comment");
    }
  }
  async getComments(
    getAllCommentsQueriesDto: GetAllCommentsQueriesDto,
    getAllCommentsParamsDto: GetAllCommentsParamsDto,
    getAllCommentsRequestDto: GetAllCommentsRequestDto,
  ) {
    const {
      parentId,
      query,
      limit = 3,
      page = 1,
      orderBy = CommentOrderBy.ASC,
    } = getAllCommentsQueriesDto;
    const { postSlug } = getAllCommentsParamsDto;
    const { userId } = getAllCommentsRequestDto;

    const parentObjId = parentId ? parseInt(parentId) : undefined;
    try {
      const post = await this.postRepo.findOneBy({
        slug: postSlug,
        status: PostStatus.PUBLISHED
      });
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      const comments = await GetNestedComments(
        this.commentRepo,
        parentObjId,
        post.id,
        page,
        limit,
        orderBy
      );
      const results = comments.slice(0, limit);
      return {
        results,
        hasNextPage: comments.length > 0
      }
    } catch (err) {
      this.logger.error(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to get comments");
    }
  }

  async addComment(
    addCommentBodyDto: AddCommentBodyDto,
    addCommentParamsDto: AddCommentParamsDto,
    addCommentRequestDto: AddCommentRequestDto,
  ) {
    const { content, parentId = undefined } = addCommentBodyDto;
    const { postSlug } = addCommentParamsDto;
    const { userId } = addCommentRequestDto;
    try {
      const post = await this.postRepo.findOneBy({
        slug: postSlug
      });
      if (!post || post.status === PostStatus.DELETED) {
        throw new NotFoundException("Post doesn't exist");
      }
      const comment = await this.commentRepo.save(
        this.commentRepo.create({
          content,
          user: {
            id: userId
          },
          parent: {
            id: parentId
          },

          post: {
            id: post.id
          }
        })
      );
      this.postRepo.increment({ id: post.id }, "totalComments", 1);
      return {
        message: "success",
        commentId: comment.id
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to add comment");
    }
  }

  async updateComment(
    updateCommentParamsDto: UpdateCommentParamsDto,
    updateCommentRequestDto: UpdateCommentRequestDto,
    updateCommentBodyDto: UpdateCommentBodyDto
  ) {
    const { userId } = updateCommentRequestDto;
    const commentId = parseInt(updateCommentParamsDto.commentId);
    try {
      const comment = await this.commentRepo.update({
        user: {
          id: userId
        },
        id: commentId
      }, {
        content: updateCommentBodyDto.content
      });
      if (!comment.affected) {
        throw new NotFoundException("Failed to update comment");
      }
      return {
        message: "success"
      }
    } catch (err) {
      this.logger.error(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to update comment");
    }
  }

  async deleteComment(
    deleteCommentParamsDto: DeleteCommentParamsDto,
    deleteCommentRequestDto: DeleteCommentRequestDto
  ) {
    const { userId } = deleteCommentRequestDto;
    const commentId = parseInt(deleteCommentParamsDto.commentId);
    try {
      const comment = await this.commentRepo
        .createQueryBuilder()
        .update(Comment)
        .set({ status: CommentStatus.DELETED })
        .where("id = :commentId", { commentId })
        .andWhere("userId = :userId", { userId })
        .returning(["id"])
        .execute();
      if (!comment.raw || comment.raw.length === 0) {
        throw new NotFoundException("Failed to delete comment");
      }
      await this.postRepo.increment({ id: comment.raw[0].id }, "totalComments", 1)
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete comment");
    }
  }


  async voteComment(
    voteCommentBodyDto: VoteCommentBodyDto,
    voteCommentParamsDto: VoteCommentParamsDto,
    voteCommentRequestDto: VoteCommentRequestDto
  ) {
    const commentId = parseInt(voteCommentParamsDto.commentId);
    const userId = voteCommentRequestDto.userId;
    const voteType = voteCommentBodyDto?.voteType || VoteType.NEUTRAL;
    try {
      const comment = await this.commentRepo.findOneBy({ id: commentId });
      if (!comment) {
        throw new NotFoundException("Comment doesn't exist");
      }
      const commentVote = await this.commentVoteRepo.upsert({
        comment: {
          id: commentId,
        },
        user: {
          id: userId
        },
        voteType
      }, {
        conflictPaths: ["comment.id", "user.id"],
        returning: ["id"]
      });
      if (!commentVote) {
        throw new NotFoundException("Failed to vote");
      }
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to cast vote");
    }

  }
}
