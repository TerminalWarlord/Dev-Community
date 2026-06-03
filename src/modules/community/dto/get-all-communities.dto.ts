import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class GetCommunitiesQueriesDto {
  @IsOptional()
  @IsString()
  query!: string;

  @IsOptional()
  @IsNumberString()
  limit!: string;

  @IsOptional()
  @IsNumberString()
  page!: string;
}


export class GetCommunitiesRequestDto {
  @IsNumber()
  userId!: number;
}