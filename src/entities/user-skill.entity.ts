import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { Skill } from "./skill.entity";
import { SkillStatus } from "src/common/skill.enum";

@Entity()
export class UserSkill {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'enum', enum: SkillStatus, default: SkillStatus.ACTIVE })
  status!: SkillStatus

  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: "CASCADE" })
  user!: User

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: "CASCADE" })
  skill!: Skill

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}