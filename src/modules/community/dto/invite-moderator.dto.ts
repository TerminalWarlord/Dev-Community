import { IsString } from "class-validator";

export class InviteModeratorParamsDto {
  @IsString()
  communityId!: string;

  @IsString()
  userId!: string;
}

export class InviteModeratorRequestDto {
  @IsString()
  userId!: string;
}