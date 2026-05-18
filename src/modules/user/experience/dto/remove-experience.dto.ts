import { IsString } from "class-validator";

export class RemoveExperienceDto{
  @IsString()
  experienceId!: string;
  
  @IsString()
  userId!: string;
}