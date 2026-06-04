import { IsNumber, IsString } from "class-validator";

export class CreateSkillBodyDto {
  @IsString()
  skillTitle!: string;
}


export class CreateSkillRequestDto {
  @IsNumber()
  userId!: number;
}