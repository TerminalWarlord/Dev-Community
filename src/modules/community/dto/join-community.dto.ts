import { IsNumber, IsNumberString } from "class-validator";

export class JoinCommunityRequestDto {
  @IsNumber()
  userId!: number;
}

export class JoinCommunityParamsDto {
  @IsNumberString()
  communityId!: string;
}