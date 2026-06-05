import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Post } from "./post.entity";
import { User } from "./user.entity";
import { CommentStatus } from "src/common/comment.enum";
import { CommentVote } from "./comment-vote.entity";


@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text" })
  content!: string;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: "parentId" })
  parent!: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children!: Comment[];

  @ManyToOne(() => Post, (post) => post.comments, { nullable: true })
  post!: Post;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  user!: User;

  @Column({
    type: "enum",
    enum: CommentStatus,
    default: CommentStatus.PUBLISHED
  })
  status!: CommentStatus;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes!: CommentVote;

  @Column({ type: "int", default: 0 })
  totalVotes!: number;

  @Column({ type: "int", default: 0 })
  totalUpvotes!: number;

  @Column({ type: "int", default: 0 })
  totalDownvotes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
