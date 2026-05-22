import { IsOptional, IsString } from "class-validator";

export class GetPostQueriesDto {
  @IsOptional()
  @IsString()
  communityId!: string;
}

export class GetPostParamsDto {
  @IsString()
  postSlug!: string;
}