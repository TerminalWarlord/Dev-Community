import { IsNumberString, IsOptional, IsString } from "class-validator";

export class GetPostQueriesDto {
  @IsOptional()
  @IsNumberString()
  communityId!: string;
}

export class GetPostParamsDto {
  @IsString()
  postSlug!: string;
}