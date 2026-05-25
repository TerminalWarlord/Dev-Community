import { Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { DeleteUserDto } from './dto/delete-user.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Post } from 'src/schemas/post.schema';
import { Comment } from 'src/schemas/comment.schema';
import { Community } from 'src/schemas/community.schema';
import { UserStatus } from 'src/common/user.enum';


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
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to delete user");
    }
  }

  async deletePost() {

  }
  async deleteComment() {

  }

  async deleteCommunity() {

  }
}
