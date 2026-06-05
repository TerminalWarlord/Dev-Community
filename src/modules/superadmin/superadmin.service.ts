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
import { PostStatus } from 'src/common/post.enum';
import { CommentStatus } from 'src/common/comment.enum';
import { CommunityStatus } from 'src/common/community.enum';


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
    try {
      const post = await this.postRepo.update({
        slug: deletePostDto.postSlug
      }, {
        status: PostStatus.DELETED
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
      const commentId = parseInt(deleteCommentDto.commentId);
      const comment = await this.commentRepo.update({
        id: commentId
      }, {
        status: CommentStatus.DELETED
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
      const communityId = parseInt(deleteCommunityDto.communityId);
      const community = await this.communityRepo.update({
        id: communityId
      }, {
        status: CommunityStatus.DELETED
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
