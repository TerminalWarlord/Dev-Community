import { VoteType } from 'src/common/post.enum';
import { Column, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Index(["post", "user"], { unique: true })
export class PostVote {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Post, (post) => post.votes)
  post!: Post;

  @ManyToOne(() => User, (user) => user.votes)
  user!: User;

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.NEUTRAL
  })
  voteType!: VoteType;
}
