import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MembershipStatus, Role } from 'src/common/community.enum';

export type ExperienceDocument = HydratedDocument<CommunityRole>;

@Schema({ timestamps: true })
export class CommunityRole {
  @Prop({ type: String, required: true, enum: Role, default: Role.USER })
  role!: string;

  @Prop({ type: String, required: true, enum: MembershipStatus, default: MembershipStatus.REGULAR })
  status!: string;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Community" })
  communityId!: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  joinedAt!: Date;
}

export const CommunityRoleSchema = SchemaFactory.createForClass(CommunityRole);

CommunityRoleSchema.index({
  userId: 1, communityId: 1
}, { unique: true })