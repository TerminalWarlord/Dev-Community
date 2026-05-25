import { Logger } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { CommentOrderBy, CommentStatus } from "src/common/comment.enum";
import { Comment } from "src/schemas/comment.schema";
import { CommentService } from "./comment.service";

export async function GetNestedComments(
  commentModel: Model<Comment>,
  parentId: mongoose.Types.ObjectId | null,
  postId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 3,
  orderBy: CommentOrderBy = CommentOrderBy.ASC
) {
  // TODO: add sorting
  const logger = new Logger(CommentService.name);
  const offset = (Math.max(page, 0) - 1) * Math.min(limit, 10);
  logger.debug(orderBy)
  const comments = await commentModel.find({
    postId,
    parentId,
    status: CommentStatus.PUBLISHED
  })
    .populate("userId", "fname lname")
    .select("-__v -status")
    .sort({
      createdAt: orderBy === CommentOrderBy.ASC ? 1 : -1
    })
    .skip(offset)
    .limit(limit + 1)
    .lean();
  const results = comments.slice(0, limit);
  const updatedResults = Promise.all(
    results.map(async (comment) => {
      return {
        ...comment,
        childrenCount: await commentModel.countDocuments({
          postId,
          parentId: comment._id,
          status: CommentStatus.PUBLISHED
        }),
        children: await GetNestedComments(
          commentModel,
          comment._id,
          postId,
          1,
          limit,
          orderBy
        )
      }
    })
  )
  return updatedResults;
}