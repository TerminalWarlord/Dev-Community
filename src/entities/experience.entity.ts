import { UserStatus } from "src/common/user.enum"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./user.entity";
import { ExperienceStatus } from "src/common/experience.enum";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, (user) => user.experiences)
  user!: User

  @Column()
  companyName!: string;

  @Column()
  experienceTitle!: string;

  @Column({
    type: "enum",
    enum: ExperienceStatus,
    default: ExperienceStatus.ACTIVE
  })
  status!: ExperienceStatus;

  @Column({ nullable: true })
  startDate!: Date;

  @Column({ nullable: true })
  endDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}