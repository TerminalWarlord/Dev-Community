import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CommunityStatus } from 'src/common/community.enum';

export type ExperienceDocument = HydratedDocument<Community>;

@Schema({ timestamps: true })
export class Community {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true, unique: true })
  slug!: string;

  @Prop({ type: String, required: true })
  description!: string;

  @Prop({ type: String, enum: CommunityStatus, default: CommunityStatus.ACTIVE, required: true })
  status!: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);