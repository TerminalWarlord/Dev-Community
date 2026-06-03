import { VoteType } from 'src/common/post.enum';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';


@Entity()
@Index(["comment", "user"], { unique: true })
export class CommentVote {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment!: Comment;

  @ManyToOne(() => User, (user) => user.commentVotes)
  user!: User;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.NEUTRAL
  })
  voteType!: VoteType;
}