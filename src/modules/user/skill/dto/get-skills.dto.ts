import { IsNumber, IsOptional, Max, Min } from "class-validator";

export class GetSkillsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit!: number;
}