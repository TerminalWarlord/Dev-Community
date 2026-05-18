import { IsString } from "class-validator";

export class RemoveSkillDto {
  @IsString()
  userSkillId!: string;

  @IsString()
  userId!: string;
}