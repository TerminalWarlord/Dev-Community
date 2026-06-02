import { UserStatus } from "src/common/user.enum"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  fname!: string

  @Column()
  lname!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column({ nullable: true })
  avatar!: string

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.USER,
  })
  status!: UserStatus
}