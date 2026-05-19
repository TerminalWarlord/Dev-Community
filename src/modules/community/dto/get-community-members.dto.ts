import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class GetCommunityMembersQueriesDto {
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

export class GetCommunityMembersParamsDto {
  @IsString()
  communityId!: string;
}