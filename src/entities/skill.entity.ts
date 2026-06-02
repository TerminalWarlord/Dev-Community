import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { UserSkill } from "./user-skill.entity";

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, })
  skillTitle!: string;

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills!: UserSkill[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}