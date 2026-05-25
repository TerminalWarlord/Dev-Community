import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { DeleteUserDto } from './dto/delete-user.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Post } from 'src/schemas/post.schema';
import { Comment } from 'src/schemas/comment.schema';
import { Community } from 'src/schemas/community.schema';
import { UserStatus } from 'src/common/user.enum';
import { DeletePostDto } from './dto/delete-post.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { DeleteCommunityDto } from './dto/delete-community.dto';


@Injectable()
export class SuperadminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
    @InjectModel(Community.name)
    private readonly communityModel: Model<Community>,
  ) { }
  async deleteUser(deleteUserDto: DeleteUserDto) {
    try {
      const userId = new mongoose.Types.ObjectId(deleteUserDto.userId);
      const user = await this.userModel.findOneAndUpdate({
        _id: userId
      }, {
        status: UserStatus.DELETED
      });
      if (!user) {
        throw new NotFoundException("User doesn't exist");
      }
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete user");
    }
  }

  async deletePost(deletePostDto: DeletePostDto) {
    try {
      const post = await this.postModel.findOneAndUpdate({
        slug: deletePostDto.postSlug
      }, {
        status: UserStatus.DELETED
      });
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete post");
    }
  }
  async deleteComment(deleteCommentDto: DeleteCommentDto) {
    try {
      const commentId = new mongoose.Types.ObjectId(deleteCommentDto.commentId);
      const comment = await this.userModel.findOneAndUpdate({
        _id: commentId
      }, {
        status: UserStatus.DELETED
      });
      if (!comment) {
        throw new NotFoundException("Comment doesn't exist");
      }
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete Comment");
    }
  }

  async deleteCommunity(deleteCommunityDto: DeleteCommunityDto) {
    try {
      const communityId = new mongoose.Types.ObjectId(deleteCommunityDto.communityId);
      const community = await this.userModel.findOneAndUpdate({
        _id: communityId
      }, {
        status: UserStatus.DELETED
      });
      if (!community) {
        throw new NotFoundException("Community doesn't exist");
      }
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete Community");
    }
  }
}
