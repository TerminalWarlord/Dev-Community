import { IsNumber, IsNumberString, IsOptional, Max, Min } from "class-validator";

export class GetSkillsDto {
  @IsOptional()
  @IsNumberString()
  page!: string;

  @IsOptional()
  @IsNumberString()
  limit!: string;
}