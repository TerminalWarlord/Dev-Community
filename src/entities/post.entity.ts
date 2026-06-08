import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { Community } from "./community.entity";
import { PostStatus } from "src/common/post.enum";
import { PostVote } from "./post-vote.entity";
import { Comment } from "./comment.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string;

  @Column({ type: "text" })
  content!: string;

  @ManyToOne(() => User, (user) => user.posts)
  postedBy!: User;

  @ManyToOne(() => Community, (community) => community.posts, { nullable: true })
  community!: Community;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLISHED
  })
  status!: PostStatus;

  @OneToMany(() => PostVote, (postVote) => postVote.post)
  votes!: PostVote[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments!: Comment[];

  @Column({ type: 'int', default: 0 })
  views!: number;

  @Column({ type: "int", default: 0 })
  totalVotes!: number;

  @Column({ type: "int", default: 0 })
  totalUpvotes!: number;

  @Column({ type: "int", default: 0 })
  totalDownvotes!: number;

  @Column({ type: "int", default: 0 })
  totalComments!: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  publishAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}