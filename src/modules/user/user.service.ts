import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { UserSkill } from 'src/schemas/user-skill.schema';
import { GetUsersSkillsParamsDto, GetUsersSkillsQueriesDto } from './dto/get-users-skills.dto';
import { GetUsersExperiencesParamsDto, GetUsersExperiencesQueriesDto } from './dto/get-users-experiences.dto';
import { Experience } from 'src/schemas/experience.schema';
import { AddUserPostDto, AddUserPostRequestDto } from './dto/add-user-post.dto';
import { Post as PostModel } from 'src/schemas/post.schema';
import { GetUserPost } from './dto/get-user-post.dto';
import { GetUserPostsParamsDto, GetUserPostsQueriesDto } from './dto/get-user-posts.dto';
import { UpdateUserPostBodyDto, UpdateUserPostParamsDto, UpdateUserPostRequestDto } from './dto/update-user-post.dto';
import { castVote, managePost, PostOperationType } from '../community/post/post.helper';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { DeleteUserPostParamsDto, DeleteUserPostRequestDto } from './dto/delete-user-post.dto';
import { VotePostBodyDto, VotePostParamsDto, VotePostRequestDto } from '../community/post/dto/vote-post.dto';
import { PostVote } from 'src/schemas/post-votes.schema';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name)
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserSkill.name)
    private readonly userSkillModel: Model<UserSkill>,
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,
    @InjectModel(PostModel.name)
    private readonly postModel: Model<PostModel>,
    @InjectModel(PostVote.name)
    private readonly postVoteModel: Model<PostVote>,
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
  ) { }

  async getUserProfile(userId: string) {
    const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId)).select("-password -__v -updatedAt");
    return user;
  }

  async getUserSkills(getUsersSkillsParamsDto: GetUsersSkillsParamsDto, getUsersSkillsQueriesDto: GetUsersSkillsQueriesDto) {
    const page = getUsersSkillsQueriesDto.page || 1;
    const limit = getUsersSkillsQueriesDto.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const userSkills = await this.userSkillModel.find({
        userId: new mongoose.Types.ObjectId(getUsersSkillsParamsDto.userId)
      })
        .populate("skillId", "skillTitle")
        .select("-userId -__v")
        .skip(offset)
        .limit(limit + 1);

      const results = userSkills.slice(0, limit).map(item => {
        return {
          userSkillId: item._id,
          skillId: (item.skillId as unknown as { _id: string })._id,
          skillTitle: (item.skillId as unknown as { skillTitle: string }).skillTitle
        }
      });
      return {
        results,
        hasNextPage: userSkills.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get user skills");
    }
  }

  async getUserExperiences(getUsersExperienceParamsDto: GetUsersExperiencesParamsDto, getUsersExperiencesQueriesDto: GetUsersExperiencesQueriesDto) {
    const page = getUsersExperiencesQueriesDto.page || 1;
    const limit = getUsersExperiencesQueriesDto.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const userExperiences = await this.experienceModel.find({
        userId: new mongoose.Types.ObjectId(getUsersExperienceParamsDto.userId)
      })
        .select("-createdAt -updatedAt -userId -__v")
        .skip(offset)
        .limit(limit + 1);

      const results = userExperiences.slice(0, limit);
      return {
        results,
        hasNextPage: userExperiences.length > limit
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to get user experiences");
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const user = await this.userModel.findById(
      new mongoose.Types.ObjectId(userId),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    try {
      const passwordMatches = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (!passwordMatches) {
        throw new ForbiddenException('Old password is incorrect');
      }
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      try {
        await this.userModel.updateOne(
          { _id: user._id },
          {
            password: hashedPassword,
          },
        );
        return {
          message: "You've successfully changed your password",
        };
      } catch (err) {
        throw new InternalServerErrorException(
          'Failed to update user password',
        );
      }
    } catch (err) {
      throw new ForbiddenException('Old password is incorrect');
    }
  }

  async getUserPost(getUserPost: GetUserPost) {
    try {
      const post = await this.postModel.findOne({
        slug: getUserPost.postSlug,
        communityId: undefined,
      })
        .populate("postedBy", "_id fname lname")
        .select("-_id -__v")
      if (!post) {
        throw new NotFoundException("Post doesn't exist");
      }
      return post
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException("Failed to get post");
    }
  }

  async getUserPosts(
    getUserPostsQueriesDto: GetUserPostsQueriesDto,
    getUserPostsParamsDto: GetUserPostsParamsDto
  ) {
    try {
      const limit = getUserPostsQueriesDto.limit || 20;
      const page = getUserPostsQueriesDto.page || 1;
      const offset = (page - 1) * limit;
      const query = getUserPostsQueriesDto.query;
      const postFilter: {
        communityId: undefined,
        postedBy: mongoose.Types.ObjectId,
        title?: object
      } = {
        communityId: undefined,
        postedBy: new mongoose.Types.ObjectId(getUserPostsParamsDto.userId)
      }
      if (query) {
        postFilter.title = {
          $regex: query,
          $options: "i"
        }
      }
      const posts = await this.postModel.find(postFilter)
        .populate("postedBy", "_id fname lname")
        .select("-_id -__v -status")
        .skip(offset)
        .limit(limit + 1);
      const results = posts.slice(0, limit);
      return {
        results,
        hasNextPage: posts.length > limit
      }
    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException("Failed to get user posts");
    }
  }


  async addUserPost(
    addUserPostDto: AddUserPostDto,
    addUserPostRequestDto: AddUserPostRequestDto,
  ) {
    try {
      const post = await this.postModel.insertOne({
        content: addUserPostDto.content,
        postedBy: new mongoose.Types.ObjectId(addUserPostRequestDto.userId),
        slug: addUserPostDto.slug,
        title: addUserPostDto.title
      });
      return {
        message: "success",
        slug: post.slug,
        title: post.title,
        content: post.content
      }
    } catch (err) {
      throw new InternalServerErrorException("Failed to create post");
    }
  }

  async updateUserPost(
    updateUserPostBodyDto: UpdateUserPostBodyDto,
    updateUserPostParamsDto: UpdateUserPostParamsDto,
    updateUserPostRequestDto: UpdateUserPostRequestDto
  ) {

    try {
      await managePost(
        updateUserPostParamsDto.postSlug,
        this.postModel,
        this.communityRoleModel,
        this.userModel,
        updateUserPostRequestDto.userId,
        updateUserPostRequestDto.userId,
        PostOperationType.UPDATE,
        undefined,
        updateUserPostBodyDto
      );
      return {
        message: "success"
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to update post");
    }
  }

  async deleteUserPost(
    deleteUserPostParamsDto: DeleteUserPostParamsDto,
    deleteUserPostRequestDto: DeleteUserPostRequestDto
  ) {
    try {
      await managePost(
        deleteUserPostParamsDto.postSlug,
        this.postModel,
        this.communityRoleModel,
        this.userModel,
        deleteUserPostParamsDto.userId,
        deleteUserPostRequestDto.userId,
        PostOperationType.DELETION
      );
      return {
        message: "success"
      }
    } catch (err) {
      this.logger.error(err)
      if (err instanceof NotFoundException) {
        throw new NotFoundException(err.message)
      }
      else if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message)
      }
      throw new InternalServerErrorException("Failed to update post");
    }
  }
  async voteUserPost(
    votePostBodyDto: VotePostBodyDto,
    votePostParamsDto: VotePostParamsDto,
    votePostRequestDto: VotePostRequestDto,
  ) {
    try {
      await castVote(
        votePostRequestDto.userId,
        votePostParamsDto.postSlug,
        votePostBodyDto?.voteType,
        this.postVoteModel,
        this.postModel
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
