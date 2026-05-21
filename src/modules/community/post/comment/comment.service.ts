import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { AddCommentBodyDto, AddCommentParamsDto, AddCommentRequestDto } from './dto/add-comment.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from 'src/schemas/comment.schema';
import { Post } from 'src/schemas/post.schema';
import { PostStatus } from 'src/common/post.enum';

@Injectable()
export class CommentService {
  private logger = new Logger(CommentService.name);
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) { }

  async getComment() {
  }
  async getComments() {
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
