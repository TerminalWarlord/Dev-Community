import { Logger } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { CommentStatus } from "src/common/comment.enum";
import { Comment } from "src/schemas/comment.schema";
import { CommentService } from "./comment.service";

export async function GetNestedComments(
  commentModel: Model<Comment>,
  parentId: mongoose.Types.ObjectId | null,
  postId: mongoose.Types.ObjectId,
  page: number = 1,
  limit: number = 3,
) {
  // TODO: add sorting
  const logger = new Logger(CommentService.name);
  const offset = (Math.max(page, 0) - 1) * Math.min(limit, 10);

  const comments = await commentModel.find({
    postId,
    parentId,
    status: CommentStatus.PUBLISHED
  })
    .populate("userId", "fname lname")
    .select("-__v -status")
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
          limit
        )
      }
    })
  )
  return updatedResults;
}

// // response schema
// {
//   results: [
//     {
//       id: 1,
//       content: "hello world",
//       subcommentCount: 2,
//       children: [
//         {
//           id: 2,
//           content: "hello world 2",
//           subcommentCount: 0,
//           children: []
//         },
//         {
//           id: 3,
//           content: "hello world 3",
//           subcommentCount: 3,
//           children: [
//             {
//               id: 4,
//               content: "hello world 4",
//               subcommentCount: 0,
//               children: []
//             },
//             {
//               id: 5,
//               content: "hello world 5",
//               subcommentCount: 0,
//               children: []
//             },
//             {
//               id: 6,
//               content: "hello world 6",
//               subcommentCount: 0,
//               children: []
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }