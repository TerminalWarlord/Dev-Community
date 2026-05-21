import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AddCommentBodyDto, AddCommentParamsDto, AddCommentRequestDto } from './dto/add-comment.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { Post } from 'src/schemas/post.schema';
import { PostStatus } from 'src/common/post.enum';
import { GetCommentParamsDto } from './dto/get-comment.dto';
import { CommentStatus } from 'src/common/comment.enum';
import { GetAllCommentsParamsDto, GetAllCommentsQueriesDto, GetAllCommentsRequestDto } from './dto/get-all-comments.dto';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) { }

  async getComment(
    getCommentParamsDto: GetCommentParamsDto
  ) {
    try {
      // TODO: check if user has access to get comment (community post/comments arent public)
      const commentId = new mongoose.Types.ObjectId(getCommentParamsDto.commentId);
      const comment = await this.commentModel.findOne({
        _id: commentId,
        status: CommentStatus.PUBLISHED
      }).select("-parentId -status -__v");
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
    const { limit = 20, page = 1, query } = getAllCommentsQueriesDto;
    const { postSlug } = getAllCommentsParamsDto;
    const { userId } = getAllCommentsRequestDto;

    // TODO: check if has rights to view the comments

    const offset = (page - 1) * limit;
    try {
      const post = await this.postModel.findOne({
        slug: postSlug,
        status: PostStatus.PUBLISHED
      });
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      // TODO: get the nest results 
      const comments = await this.commentModel.find({
        postId: post._id
      })
        .populate("userId", "fname lname")
        .select("-createdAt -updatedAt -__v -status")
        .skip(offset)
        .limit(limit + 1);

      const results = comments.slice(0, limit);
      return {
        results,
        hasNextPage: comments.length > limit
      }
    } catch (err) {
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
    const userId = new mongoose.Types.ObjectId(addCommentRequestDto.userId);
    // TODO: if its a community post, user has to be a member of it
    try {
      const post = await this.postModel.findOne({
        slug: postSlug
      });
      if (!post || post.status === PostStatus.DELETED) {
        throw new NotFoundException("Post doesn't exist");
      }
      const comment = await this.commentModel.insertOne({
        content,
        userId,
        parentId: parentId ? new mongoose.Types.ObjectId(parentId) : parentId,
        postId: post._id
      });
      return {
        message: "success",
        commentId: comment._id
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to add comment");
    }
  }

  async updateComment() {
  }

  async deleteComment() {
  }
}
