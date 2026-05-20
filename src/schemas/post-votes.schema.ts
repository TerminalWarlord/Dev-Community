import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExperienceDocument = HydratedDocument<PostVote>;

@Schema({ timestamps: true })
export class PostVote {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Post" })
  postId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: Boolean, required: true, default: true })
  isUpvote!: boolean;
}

export const PostVoteSchema = SchemaFactory.createForClass(PostVote);