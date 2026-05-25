import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";
import { PostFilter, PostOrderBy } from "src/common/post.enum";

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

  @IsOptional()
  @IsString()
  filter!: PostFilter;

  @IsOptional()
  @IsString()
  orderBy!: PostOrderBy;
}

export class GetPostsRequestDto {
  @IsOptional()
  @IsString()
  userId!: string;
}