import { CommunityStatus } from "src/common/community.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { CommunityRole } from "./community-role.entity";
import { Post } from "./post.entity";

@Entity()
export class Community {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @Column({ type: "text" })
  description!: string;

  @OneToMany(() => CommunityRole, (communityRole) => communityRole.community)
  communityRoles!: CommunityRole[]

  @OneToMany(() => Post, (post) => post.community)
  posts!: Post[]

  @Column({
    type: "enum",
    enum: CommunityStatus,
    default: CommunityStatus.ACTIVE,
  })
  status!: CommunityStatus;


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
