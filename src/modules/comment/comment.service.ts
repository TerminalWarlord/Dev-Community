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
    private readonly postRepo: Repository<Post>
    // @InjectModel(Post.name)
    // private readonly postModel: Model<Post>,
    // @InjectModel(CommentVote.name)
    // private readonly commentVoteModel: Model<CommentVote>
  ) { }

  async getComment(
    getCommentParamsDto: GetCommentParamsDto
  ) {
    // try {
    //   // TODO: check if user has access to get comment (community post/comments arent public)
    //   const commentId = new mongoose.Types.ObjectId(getCommentParamsDto.commentId);
    //   const comment = await this.commentModel.findOne({
    //     _id: commentId,
    //     status: CommentStatus.PUBLISHED
    //   }).select("-parentId -status -__v");
    //   if (!comment) {
    //     throw new NotFoundException("Comment doesn't exist");
    //   }
    //   return comment;
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to get comment");
    // }
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

    // const parentObjId = parentId ? new mongoose.Types.ObjectId(parentId) : null;
    // TODO: check if has rights to view the comments
    // try {
    //   const post = await this.postModel.findOne({
    //     slug: postSlug,
    //     status: PostStatus.PUBLISHED
    //   });
    //   if (!post) {
    //     throw new NotFoundException("Post doesn't exist");
    //   }
    //   const comments = await GetNestedComments(
    //     this.commentModel,
    //     parentObjId,
    //     post._id,
    //     page,
    //     limit,
    //     orderBy
    //   );
    //   const results = comments.slice(0, limit);
    //   return {
    //     results,
    //     hasNextPage: comments.length > 0
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to get comments");
    // }
  }

  async addComment(
    addCommentBodyDto: AddCommentBodyDto,
    addCommentParamsDto: AddCommentParamsDto,
    addCommentRequestDto: AddCommentRequestDto,
  ) {
    const { content, parentId = undefined } = addCommentBodyDto;
    const { postSlug } = addCommentParamsDto;
    const { userId } = addCommentRequestDto;
    console.log(parentId)
    // TODO: if its a community post, user has to be a member of it
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
    // const userId = new mongoose.Types.ObjectId(updateCommentRequestDto.userId);
    // const commentId = new mongoose.Types.ObjectId(updateCommentParamsDto.commentId);
    // try {
    //   const comment = await this.commentModel.findOneAndUpdate({
    //     userId,
    //     _id: commentId
    //   }, {
    //     content: updateCommentBodyDto.content
    //   });
    //   if (!comment) {
    //     throw new NotFoundException("Comment doesn't exist");
    //   }
    //   return {
    //     message: "success"
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to update comment");
    // }
  }

  async deleteComment(
    deleteCommentParamsDto: DeleteCommentParamsDto,
    deleteCommentRequestDto: DeleteCommentRequestDto
  ) {
    // const userId = new mongoose.Types.ObjectId(deleteCommentRequestDto.userId);
    // const commentId = new mongoose.Types.ObjectId(deleteCommentParamsDto.commentId);
    // try {
    //   const comment = await this.commentModel.findOneAndUpdate({
    //     userId,
    //     _id: commentId
    //   }, {
    //     status: CommentStatus.DELETED
    //   });
    //   if (!comment) {
    //     throw new NotFoundException("Comment doesn't exist");
    //   }
    //   await this.postModel.updateOne({
    //     _id: comment.postId
    //   }, {
    //     $inc: {
    //       totalComments: -1
    //     }
    //   })
    //   return {
    //     message: "success"
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to delete comment");
    // }
  }


  async voteComment(
    voteCommentBodyDto: VoteCommentBodyDto,
    voteCommentParamsDto: VoteCommentParamsDto,
    voteCommentRequestDto: VoteCommentRequestDto
  ) {
    // const commentId = new mongoose.Types.ObjectId(voteCommentParamsDto.commentId);
    // const userId = new mongoose.Types.ObjectId(voteCommentRequestDto.userId);
    // const voteType = voteCommentBodyDto?.voteType || VoteType.NEUTRAL;
    // try {
    //   const comment = await this.commentModel.findById(commentId);
    //   if (!comment) {
    //     throw new NotFoundException("Comment doesn't exist");
    //   }
    //   const commentVote = await this.commentVoteModel.findOneAndUpdate({
    //     commentId,
    //     userId
    //   }, {
    //     voteType
    //   }, { upsert: true });
    //   if (!commentVote) {

    //   }
    //   return {
    //     message: "success"
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to cast vote");
    // }

  }
}
