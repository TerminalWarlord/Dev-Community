import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { Community } from "./community.entity";
import { PostStatus } from "src/common/post.enum";
import { PostVote } from "./post-vote.entity";

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

  @ManyToOne(() => Community, (community) => community.posts)
  community!: Community;

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.PUBLISHED
  })
  status!: PostStatus;

  @OneToMany(() => PostVote, (postVote) => postVote.post)
  votes!: PostVote[];

  @Column({ type: "number", default: 0 })
  totalVotes!: number;

  @Column({ type: 'number', default: 0 })
  totalDownvotes!: number;

  @Column({ type: 'number', default: 0 })
  totalComments!: number;

  @Column({ type: 'timestamptz', default: 'CURRENT_TIMESTAMP' })
  publishAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}