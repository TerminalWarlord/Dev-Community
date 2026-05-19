import { IsString } from "class-validator";

export class BanACommunityMemberParamsDto {
  @IsString()
  communityId!: string;

  @IsString()
  memberId!: string;
}

export class BanACommunityMemberRequestDto {
  @IsString()
  userId!: string;
}