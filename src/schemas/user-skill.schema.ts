import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserSkillDocument = HydratedDocument<UserSkill>;

@Schema({ timestamps: true })
export class UserSkill {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
  userId!: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Skill" })
  skillId!: mongoose.Types.ObjectId;
}

export const UserSkillSchema = SchemaFactory.createForClass(UserSkill);
