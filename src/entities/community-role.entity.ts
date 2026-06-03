import { CommunityStatus, MembershipStatus, Role } from "src/common/community.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { Community } from "./community.entity";

@Entity()
@Unique("user_community_unique", ["user", "community"])
export class CommunityRole {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  role!: Role;

  @Column({
    type: "enum",
    enum: MembershipStatus,
    default: MembershipStatus.REGULAR
  })
  status!: MembershipStatus;

  @ManyToOne(() => User, (user) => user.communityRoles)
  user!: User;

  @ManyToOne(() => Community, (community) => community.communityRoles)
  community!: Community;

  @Column({ type: "timestamptz", nullable: true })
  joinedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

