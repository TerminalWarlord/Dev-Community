import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";

export class GetPostsQueriesDto {
  @IsOptional()
  @IsNumberString()
  page!: string;

  @IsOptional()
  @IsNumberString()
  limit!: string;

  @IsOptional()
  @IsString()
  query!: string;

  @IsOptional()
  @IsString()
  communityId!: string;

  @IsOptional()
  @IsString()
  profileId!: string;
}

export class GetPostsRequestDto {
  @IsOptional()
  @IsString()
  userId!: string;
}