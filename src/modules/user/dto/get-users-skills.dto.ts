import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetUsersSkillsParamsDto {
  @IsString()
  userId!: string;
}


export class GetUsersSkillsQueriesDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  limit!: number;
}