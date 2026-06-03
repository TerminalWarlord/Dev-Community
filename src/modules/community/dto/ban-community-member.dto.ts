import { IsNumber, IsNumberString } from "class-validator";

export class BanACommunityMemberParamsDto {
  @IsNumberString()
  communityId!: string;

  @IsNumberString()
  memberId!: string;
}

export class BanACommunityMemberRequestDto {
  @IsNumber()
  userId!: number;
}