import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { VoteType } from 'src/common/post.enum';

export type PostVoteDocument = HydratedDocument<PostVote>;

@Schema({ timestamps: true })
export class PostVote {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Post" })
  postId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, enum: VoteType, default: VoteType.UPVOTE })
  voteType!: string;
}

export const PostVoteSchema = SchemaFactory.createForClass(PostVote);

PostVoteSchema.index({
  postId: 1,
  userId: 1
}, { unique: true });