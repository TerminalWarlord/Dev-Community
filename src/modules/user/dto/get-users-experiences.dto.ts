import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetUsersExperiencesParamsDto {
  @IsString()
  userId!: string;
}


export class GetUsersExperiencesQueriesDto {
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