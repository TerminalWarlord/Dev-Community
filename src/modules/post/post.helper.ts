import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Role } from "src/common/community.enum";
import { PostStatus, VoteType } from "src/common/post.enum";
import { UpdatePostBodyDto } from "./dto/update-post.dto";
import { UserStatus } from "src/common/user.enum";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { Queue } from "bullmq";
import { MailService } from "../mail/mail.service";
import { Repository } from "typeorm";
import { Post } from "src/entities/post.entity";
import { CommunityRole } from "src/entities/community-role.entity";
import { User } from "src/entities/user.entity";
import { PostVote } from "src/entities/post-vote.entity";


export enum PostOperationType {
  DELETION = "DELETION",
  UPDATE = "UPDATE",
}

export async function managePost(
  slug: string,
  postRepo: Repository<Post>,
  communityRoleRepo: Repository<CommunityRole>,
  userRepo: Repository<User>,
  uId: number,
  operationType: PostOperationType = PostOperationType.DELETION,
  cId?: number,
  updatePostBodyDto?: UpdatePostBodyDto
) {
  const userId = uId;
  const communityId = cId ? cId : undefined;
  async function performDeletion() {
    const postUpdate = await postRepo.update({
      slug,
      community: {
        id: communityId
      }
    }, {
      status: PostStatus.DELETED
    });
    if (!postUpdate.affected) {
      throw new Error("Failed to update post");
    }
  }

  async function performUpdate() {
    await postRepo.update({
      slug,
      community: {
        id: communityId
      }
    }, {
      title: updatePostBodyDto?.title,
      content: updatePostBodyDto?.content
    });
  }
  // check user is admin/mod or the poster itself
  const post = await postRepo.findOne({
    where: {
      slug,
      community: {
        id: communityId
      }
    }
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }
  if (post.postedBy.id === uId) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }

  const communityRole = await communityRoleRepo.findOne({
    where: {
      user: {
        id: userId
      },
      community: {
        id: communityId
      }
    }
  });
  if (communityRole && (communityRole.role === Role.ADMIN || communityRole.role === Role.MODERATOR)) {
    return operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  // check actingUser is OWNER
  const user = await userRepo.findOne({
    where: {
      id: userId
    },
  });
  if (user && user.status === UserStatus.SUPERADMIN) {
    operationType === PostOperationType.DELETION ? performDeletion() : performUpdate();
  }
  throw new ForbiddenException("You can't perform this action");
}


export async function castVoteOnPost(
  userId: number,
  slug: string,
  voteType: VoteType = VoteType.NEUTRAL,
  postVoteRepo: Repository<PostVote>,
  postRepo: Repository<Post>,
  userRepo: Repository<User>,
  mailService: MailService,
  communityId?: number,
  dislikeThreshold: number = 10
) {
  const post = await postRepo.findOne({
    where: {
      community: {
        id: communityId
      },
      slug
    }
  });
  if (!post) {
    throw new NotFoundException("Post doesn't exist");
  }
  const postVoteUpdate = await postVoteRepo.update({
    post: {
      id: post.id
    },
    user: {
      id: userId
    }
  }, {
    voteType
  });
  if (!postVoteUpdate.affected) {
    return;
  }

  // TODO: optimize query to get votes
  const upvotes = await postVoteRepo.count({
    where: {
      post: {
        id: post.id
      },
      voteType: VoteType.UPVOTE
    }
  });

  const downvotes = await postVoteRepo.count({
    where: {
      post: {
        id: post.id
      },
      voteType: VoteType.DOWNVOTE
    }
  });

  // const votes = await postVoteRepo.aggregate([
  //   {
  //     $group: {
  //       _id: "$postId",
  //       upvotes: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ["$voteType", "UPVOTE"]
  //             },
  //             1,
  //             0
  //           ]
  //         }
  //       },
  //       downvotes: {
  //         $sum: {
  //           $cond: [
  //             {
  //               $eq: ["$voteType", "DOWNVOTE"]
  //             },
  //             1,
  //             0
  //           ]
  //         }
  //       },
  //       total: {
  //         $sum: 1
  //       }
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       upvotes: 1,
  //       downvotes: 1,
  //       total: 1,
  //     }
  //   }
  // ]);

  // const upvotes = votes?.length ? votes[0].upvotes : 0;
  // const downvotes = votes?.length ? votes[0].downvotes : 0;
  const totalVotes = upvotes + downvotes;

  if (downvotes > dislikeThreshold) {
    const user = await userRepo.findOne({
      where: {
        id: userId
      }
    });
    await mailService.sendEmail(
      user?.email!,
      "Dev Community Post Notice",
      `<h1> IMPORTANT NOTICE</h1>
      <p>Your post <strong>${post.title}</strong> has got more than ${dislikeThreshold} dislikes!</p>`
    )
  }

  await postRepo.update({
    community: {
      id: communityId
    },
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
      where: {
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