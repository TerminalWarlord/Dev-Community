import { UserStatus } from "src/common/user.enum"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Experience } from "./experience.entity"
import { UserSkill } from "./user-skill.entity"
import { CommunityRole } from "./community-role.entity"
import { Post } from "./post.entity"
import { PostVote } from "./post-vote.entity"

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

  @OneToMany(() => CommunityRole, (communityRole) => communityRole.community)
  communityRoles!: CommunityRole[]

  @OneToMany(() => Post, (post) => post.postedBy)
  posts!: Post[];

  @OneToMany(()=>PostVote, (postVote)=>postVote.user)
  votes!: PostVote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}