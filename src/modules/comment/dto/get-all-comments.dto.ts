import { IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from "class-validator";
import { CommentOrderBy } from "src/common/comment.enum";

export class GetAllCommentsQueriesDto {
  @IsOptional()
  @IsNumberString()
  page!: number;

  @IsOptional()
  @IsNumberString()
  limit!: number;

  @IsOptional()
  @IsString()
  query!: string;

  @IsOptional()
  @IsNumberString()
  parentId!: string;

  @IsOptional()
  @IsString()
  orderBy!: CommentOrderBy
}

export class GetAllCommentsParamsDto {
  @IsString()
  postSlug!: string;
}

export class GetAllCommentsRequestDto {
  @IsNumber()
  userId!: number;
}