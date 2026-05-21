import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetAllCommentsQueriesDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  limit!: number;

  @IsOptional()
  @IsString()
  query!: string;
}

export class GetAllCommentsParamsDto {
  @IsString()
  postSlug!: string;
}

export class GetAllCommentsRequestDto {
  @IsString()
  userId!: string;
}