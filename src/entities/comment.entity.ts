import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
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

  @OneToMany(() => Comment, (comment) => comment.children)
  parent!: Comment;

  @ManyToOne(() => Comment, (comment) => comment.parent)
  children!: Comment[];

  @ManyToOne(() => Post, (post) => post.comments)
  post!: Post;

  @ManyToMany(() => User, (user) => user.comments)
  user!: User;

  @Column({
    type: "enum",
    enum: CommentStatus,
    default: CommentStatus.PUBLISHED
  })
  status!: CommentStatus;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  votes!: CommentVote;

  @Column({ type: "number", default: 0 })
  totalVotes!: number;

  @Column({ type: "number", default: 0 })
  totalUpvotes!: number;

  @Column({ type: "number", default: 0 })
  totalDownvotes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
