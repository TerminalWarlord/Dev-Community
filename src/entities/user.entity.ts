import { UserProvider, UserStatus } from "src/common/user.enum"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Experience } from "./experience.entity"
import { UserSkill } from "./user-skill.entity"
import { CommunityRole } from "./community-role.entity"
import { Post } from "./post.entity"
import { PostVote } from "./post-vote.entity"
import { Comment } from "./comment.entity"
import { CommentVote } from "./comment-vote.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fname!: string

  @Column({ nullable: true })
  lname!: string

  @Column({ unique: true })
  email!: string

  @Column({ nullable: true })
  password!: string

  @Column({
    type: "enum",
    enum: UserProvider,
    default: UserProvider.CREDENTIALS
  })
  provider!: UserProvider

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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => PostVote, (postVote) => postVote.user)
  votes!: PostVote[];

  @OneToMany(() => CommentVote, (comment) => comment.user)
  commentVotes!: CommentVote

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}