import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetPostsQueriesDto {
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

export class GetPostsParamsDto {
  @IsString()
  communityId!: string;
}