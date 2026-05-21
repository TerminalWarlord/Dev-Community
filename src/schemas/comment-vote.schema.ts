import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { VoteType } from 'src/common/post.enum';

export type CommentVoteDocument = HydratedDocument<CommentVote>;

@Schema({ timestamps: true })
export class CommentVote {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Comment" })
  commentId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true, enum: VoteType, default: VoteType.NEUTRAL })
  voteType!: string;
}

export const CommentVoteSchema = SchemaFactory.createForClass(CommentVote);

CommentVoteSchema.index({
  commentId: 1,
  userId: 1
}, { unique: true });