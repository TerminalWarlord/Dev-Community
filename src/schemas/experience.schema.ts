import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExperienceDocument = HydratedDocument<Experience>;

@Schema({ timestamps: true })
export class Experience {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  experienceTitle!: string;

  @Prop({ type: String, required: true })
  companyName!: string;

  @Prop({ type: Date, })
  startDate!: Date;

  @Prop({ type: Date })
  endDate!: Date;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);