import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetCommunitiesQueriesDto {
  @IsOptional()
  @IsString()
  query!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page!: number;
}


export class GetCommunitiesRequestDto {
  @IsString()
  userId!: number;
}