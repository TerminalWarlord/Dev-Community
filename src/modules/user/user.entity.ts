import { UserStatus } from "src/common/user.enum"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Experience } from "./experience/experience.entity"
import { UserSkill } from "./skill/skill.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fname!: string

  @Column()
  lname!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column({ nullable: true })
  avatar!: string

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.USER,
  })
  status!: UserStatus

  @OneToMany(() => Experience, (experience) => experience.user, { onDelete: "CASCADE" })
  experiences!: Experience[]

  @OneToMany(() => UserSkill, (skill) => skill.user, { onDelete: "CASCADE" })
  userSkills!: UserSkill[]

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}