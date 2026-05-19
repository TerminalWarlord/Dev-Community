import { IsString } from "class-validator";

export class JoinCommunityRequestDto {
  @IsString()
  userId!: string;
}

export class JoinCommunityParamsDto {
  @IsString()
  communityId!: string;
}