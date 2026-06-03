import { IsNumberString } from "class-validator";

export class InviteModeratorParamsDto {
  @IsNumberString()
  communityId!: string;

  @IsNumberString()
  userId!: string;
}