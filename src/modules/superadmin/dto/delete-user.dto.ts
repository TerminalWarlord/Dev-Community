import { IsNumberString, IsString } from "class-validator";

export class DeleteUserDto {
  @IsNumberString()
  userId!: string;
}