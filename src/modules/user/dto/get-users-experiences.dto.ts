import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class GetUsersExperiencesParamsDto {
  @IsNumberString()
  userId!: string;
}


export class GetUsersExperiencesQueriesDto {
  @IsOptional()
  @IsNumberString()
  page!: string;

  @IsOptional()
  @IsNumberString()
  limit!: string;
}