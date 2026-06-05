import { Logger } from "@nestjs/common";
import { CommentOrderBy, CommentStatus } from "src/common/comment.enum";
import { CommentService } from "./comment.service";
import { Repository } from "typeorm";
import { Comment } from "src/entities/comment.entity";

export async function GetNestedComments(
  commentRepo: Repository<Comment>,
  parentId?: number,
  postId?: number,
  page: number = 1,
  limit: number = 3,
  orderBy: CommentOrderBy = CommentOrderBy.ASC
) {
  const logger = new Logger(CommentService.name);
  const offset = (Math.max(page, 0) - 1) * Math.min(limit, 10);
  logger.debug(orderBy)
  const comments = await commentRepo.find({
    where: {
      post: {
        id: postId
      },
      parent: {
        id: parentId
      },
      status: CommentStatus.PUBLISHED,
    },
    select: {
      id: true,
      user: {
        id: true,
        fname: true,
        lname: true,
      },
      content: true,
      totalVotes: true,
      totalUpvotes: true,
      totalDownvotes: true,
      createdAt: true
    },
    relations: {
      user: true
    },
    skip: offset,
    take: limit + 1,
    order: {
      createdAt: orderBy === CommentOrderBy.ASC ? "ASC" : 'DESC'
    }
  })
  const results = comments.slice(0, limit);
  const updatedResults = Promise.all(
    results.map(async (comment) => {
      return {
        ...comment,
        childrenCount: await commentRepo.count({
          where: {
            post: {
              id: postId
            },
            parent: {
              id: comment.id
            },
            status: CommentStatus.PUBLISHED
          }
        }),
        children: await GetNestedComments(
          commentRepo,
          comment.id,
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