import { IsNumber, IsNumberString } from "class-validator";

export class ManageInvitationParamsDto {
  @IsNumberString()
  invitationId!: string;

  @IsNumberString()
  communityId!: string;
}

export class ManageInvitationRequestDto {
  @IsNumber()
  userId!: number;
}