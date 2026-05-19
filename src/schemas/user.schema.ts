import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/common/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  fname!: string;

  @Prop({ type: String, required: true })
  lname!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String })
  avatar!: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.USER, required: true })
  status!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
