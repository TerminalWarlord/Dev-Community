import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { PostStatus } from 'src/common/post.enum';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  slug!: string;

  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  postedBy!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: "Community" })
  communityId!: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: PostStatus, default: PostStatus.PUBLISHED, required: true })
  status!: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({
  // communityId: 1,
  slug: 1
}, { unique: true });