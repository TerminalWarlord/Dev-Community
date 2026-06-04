import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UserStatus } from 'src/common/user.enum';
import { DeletePostDto } from './dto/delete-post.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { DeleteCommunityDto } from './dto/delete-community.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { Comment } from 'src/entities/comment.entity';
import { Community } from 'src/entities/community.entity';


@Injectable()
export class SuperadminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
  ) { }
  async deleteUser(deleteUserDto: DeleteUserDto) {
    try {
      const userId = parseInt(deleteUserDto.userId);
      const user = await this.userRepo.update({
        id: userId
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
    // try {
    //   const post = await this.postModel.findOneAndUpdate({
    //     slug: deletePostDto.postSlug
    //   }, {
    //     status: UserStatus.DELETED
    //   });
    //   if (!post) {
    //     throw new NotFoundException("Post doesn't exist");
    //   }
    //   return {
    //     message: "success"
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to delete post");
    // }
  }
  async deleteComment(deleteCommentDto: DeleteCommentDto) {
    // try {
    //   const commentId = new mongoose.Types.ObjectId(deleteCommentDto.commentId);
    //   const comment = await this.commentModel.findOneAndUpdate({
    //     _id: commentId
    //   }, {
    //     status: UserStatus.DELETED
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
    //   throw new InternalServerErrorException("Failed to delete Comment");
    // }
  }

  async deleteCommunity(deleteCommunityDto: DeleteCommunityDto) {
    // try {
    //   const communityId = new mongoose.Types.ObjectId(deleteCommunityDto.communityId);
    //   const community = await this.communityModel.findOneAndUpdate({
    //     _id: communityId
    //   }, {
    //     status: UserStatus.DELETED
    //   });
    //   if (!community) {
    //     throw new NotFoundException("Community doesn't exist");
    //   }
    //   return {
    //     message: "success"
    //   }
    // } catch (err) {
    //   if (err instanceof NotFoundException) {
    //     throw new NotFoundException(err.message);
    //   }
    //   throw new InternalServerErrorException("Failed to delete Community");
    // }
  }
}
