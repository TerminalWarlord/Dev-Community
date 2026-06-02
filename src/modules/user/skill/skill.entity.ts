import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "../user.entity";

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, })
  skillTitle!: string;

  @OneToMany(()=>UserSkill, (userSkill)=>userSkill.skill)
  userSkills!: UserSkill[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



@Entity()
export class UserSkill {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: "CASCADE" })
  user!: User

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: "CASCADE" })
  skill!: Skill

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}



// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { HydratedDocument } from 'mongoose';

// export type UserSkillDocument = HydratedDocument<UserSkill>;

// @Schema({ timestamps: true })
// export class UserSkill {
//   @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "User" })
//   userId!: mongoose.Types.ObjectId;

//   @Prop({ type: mongoose.Types.ObjectId, required: true, ref: "Skill" })
//   skillId!: mongoose.Types.ObjectId;
// }

// export const UserSkillSchema = SchemaFactory.createForClass(UserSkill);
