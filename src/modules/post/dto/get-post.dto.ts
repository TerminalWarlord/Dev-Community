import { IsDateString, IsOptional, IsString } from "class-validator";

export class GetPostQueriesDto {
  @IsOptional()
  @IsDateString()
  communityId!: string;
}

export class GetPostParamsDto {
  @IsString()
  postSlug!: string;
}