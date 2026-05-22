import { ForbiddenException, NotFoundException } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { Role } from "src/common/community.enum";
import { PostStatus, VoteType } from "src/common/post.enum";
import { CommunityRole } from "src/schemas/community-role.schema";
import { Post } from "src/schemas/post.schema";
import { UpdatePostBodyDto } from "./dto/update-post.dto";
import { User } from "src/schemas/user.schema";
import { UserStatus } from "src/common/user.enum";
import { PostVote } from "src/schemas/post-votes.schema";
import { nanoid } from "nanoid";
import slugify from "slugify";

export enum PostOperationType {
  DELETION = "DELETION",
  UPDATE = "UPDATE",
}

export async function managePost(
  slug: string,
  postModel: Model<Post>,
  communityRoleModel: Model<CommunityRole>,
  userModel: Model<User>,
  uId: string,
  actingUId: string,
  operationType: PostOperationType = PostOperationType.DELETION,
  cId?: string,
  updatePostBodyDto?: UpdatePostBodyDto
) {
  const userId = new mongoose.Types.ObjectId(uId);
  const actingUserId = new mongoose.Types.ObjectId(actingUId);
  const communityId = cId ? new mongoose.Types.ObjectId(cId) : undefined;
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
    communityId,
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }
  if (post.postedBy.toString() === uId) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }

  const communityRole = await communityRoleModel.findOne({
    userId: actingUserId,
    communityId
  });
  if (communityRole && (communityRole.role === Role.ADMIN || communityRole.role === Role.MODERATOR)) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  // check actingUser is OWNER
  const user = await userModel.findOne({
    userId: actingUserId,
  });
  if (user && user.status === UserStatus.OWNER) {
    operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  throw new ForbiddenException("You can't perform this action");
}


export async function castVote(
  userId: string,
  postSlug: string,
  voteType: VoteType = VoteType.NEUTRAL,
  postVoteModel: Model<PostVote>,
  postModel: Model<Post>,
) {
  const post = await postModel.findOne({
    slug: postSlug
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }
  await postVoteModel.updateOne({
    postId: post._id,
    userId: new mongoose.Types.ObjectId(userId)
  }, {
    voteType
  }, { upsert: true });
}



export async function generatePostSlug(name: string, postModel: Model<Post>) {
  const slug = slugify(name, {
    lower: true,
  });
  let checkedDefault = false;
  while (true) {
    let curSlug = slug;
    if (checkedDefault) {
      curSlug += "-" + nanoid();
    }
    else {
      checkedDefault = true;
    }
    const community = await postModel.findOne({
      slug: curSlug
    });
    if (!community) {
      return curSlug;
    }
  }
}