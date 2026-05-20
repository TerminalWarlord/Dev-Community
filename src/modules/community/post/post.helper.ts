import { ForbiddenException, NotFoundException } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { Role } from "src/common/community.enum";
import { PostStatus } from "src/common/post.enum";
import { CommunityRole } from "src/schemas/community-role.schema";
import { Post } from "src/schemas/post.schema";
import { UpdatePostBodyDto } from "./dto/update-post.dto";


export enum PostOperationType {
  DELETION = "DELETION",
  UPDATE = "UPDATE",
}

export async function managePost(
  slug: string,
  postModel: Model<Post>,
  communityRoleModel: Model<CommunityRole>,
  uId: string,
  operationType: PostOperationType = PostOperationType.DELETION,
  cId?: string,
  updatePostBodyDto?: UpdatePostBodyDto
) {
  const userId = new mongoose.Types.ObjectId(uId);
  const communityId = new mongoose.Types.ObjectId(cId);
  async function performDeletion() {
    await postModel.findOneAndUpdate({
      slug,
      communityId
    }, {
      status: PostStatus.DELETED
    });
  }

  async function performUpdate() {
    await postModel.findOneAndUpdate({
      slug,
      communityId: communityId ? new mongoose.Types.ObjectId(communityId) : undefined
    }, updatePostBodyDto);
  }
  // check user is admin/mod or the poster itself
  const post = await postModel.findOne({
    slug,
    communityId
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }

  if (post.postedBy === userId) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }

  const communityRole = await communityRoleModel.findOne({
    userId,
    communityId
  });
  if (!communityRole || communityRole.role === Role.USER) {
    throw new ForbiddenException("You can't perform this action");
  }
  return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
}