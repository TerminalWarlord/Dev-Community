import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ timestamps: true })
export class Skill {
  @Prop({ type: String, required: true, unique: true })
  skillTitle!: string;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
