import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { Skill } from "./skill.entity";

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