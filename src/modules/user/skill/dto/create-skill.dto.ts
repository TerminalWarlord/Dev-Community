import { IsString } from "class-validator";

export class CreateSkillDto {
  @IsString()
  skillTitle!: string;
  
  @IsString()
  userId!: string;
}