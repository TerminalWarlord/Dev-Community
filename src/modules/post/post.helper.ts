import { ForbiddenException, NotFoundException } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { Role } from "src/common/community.enum";
import { PostStatus, VoteType } from "src/common/post.enum";
import { CommunityRole } from "src/schemas/community-role.schema";
import { UpdatePostBodyDto } from "./dto/update-post.dto";
import { User } from "src/schemas/user.schema";
import { UserStatus } from "src/common/user.enum";
import { PostVote } from "src/schemas/post-votes.schema";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { Queue } from "bullmq";
import { MailService } from "../mail/mail.service";
import { Repository } from "typeorm";
import { Post } from "src/entities/post.entity";


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
  operationType: PostOperationType = PostOperationType.DELETION,
  cId?: string,
  updatePostBodyDto?: UpdatePostBodyDto
) {
  const userId = new mongoose.Types.ObjectId(uId);
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
    userId,
    communityId
  });
  if (communityRole && (communityRole.role === Role.ADMIN || communityRole.role === Role.MODERATOR)) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  // check actingUser is OWNER
  const user = await userModel.findOne({
    userId,
  });
  if (user && user.status === UserStatus.SUPERADMIN) {
    operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  throw new ForbiddenException("You can't perform this action");
}


export async function castVoteOnPost(
  userId: string,
  slug: string,
  voteType: VoteType = VoteType.NEUTRAL,
  postVoteModel: Model<PostVote>,
  postModel: Model<Post>,
  userModel: Model<User>,
  mailService: MailService,
  communityId?: mongoose.Types.ObjectId,
  dislikeThreshold: number = 10
) {
  const post = await postModel.findOne({
    communityId,
    slug,
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }
  await postVoteModel.findOneAndUpdate({
    postId: post._id,
    userId: new mongoose.Types.ObjectId(userId)
  }, {
    voteType
  }, { upsert: true });

  const votes = await postVoteModel.aggregate([
    {
      $group: {
        _id: "$postId",
        upvotes: {
          $sum: {
            $cond: [
              {
                $eq: ["$voteType", "UPVOTE"]
              },
              1,
              0
            ]
          }
        },
        downvotes: {
          $sum: {
            $cond: [
              {
                $eq: ["$voteType", "DOWNVOTE"]
              },
              1,
              0
            ]
          }
        },
        total: {
          $sum: 1
        }
      },
    },
    {
      $project: {
        _id: 1,
        upvotes: 1,
        downvotes: 1,
        total: 1,
      }
    }
  ]);

  const upvotes = votes?.length?votes[0].upvotes:0;
  const downvotes = votes?.length?votes[0].downvotes:0;
  const totalVotes = votes?.length?votes[0].total:0;

  if (downvotes > dislikeThreshold) {
    const user = await userModel.findById(new mongoose.Types.ObjectId(userId));
    await mailService.sendEmail(
      user?.email!,
      "Dev Community Post Notice",
      `<h1> IMPORTANT NOTICE</h1>
      <p>Your post <strong>${post.title}</strong> has got more than ${dislikeThreshold} dislikes!</p>`
    )
  }

  await postModel.findOneAndUpdate({
    communityId,
    slug,
  }, {
    totalVotes: totalVotes,
    totalDownvotes: downvotes,
    totalUpvotes: upvotes
  })
}



export async function generatePostSlug(name: string, postRepo: Repository<Post>) {
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
    const community = await postRepo.findOne({
      where:{
        slug: curSlug
      }
    });
    if (!community) {
      return curSlug;
    }
  }
}


export async function schedulePost(
  postId: string,
  postQueue: Queue,
  delay: number,
) {
  console.log(postId, typeof postId)
  const job = await postQueue.add("publish-post", {
    postId
  }, {
    delay,
    jobId: postId,
    attempts: 5,
    removeOnFail: true,
    removeOnComplete: true,
  })


}