import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CommentStatus } from 'src/common/comment.enum';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: "Comment" })
  parentId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: "Post", required: true })
  postId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: "User", required: true })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: CommentStatus, required: true, default: CommentStatus.PUBLISHED })
  status!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);