import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class GetUsersSkillsParamsDto {
  @IsNumberString()
  userId!: string;
}


export class GetUsersSkillsQueriesDto {
  @IsOptional()
  @IsNumberString()
  page!: string;

  @IsOptional()
  @IsNumberString()
  limit!: string;
}