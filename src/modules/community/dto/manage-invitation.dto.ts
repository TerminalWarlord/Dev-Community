import { IsString } from "class-validator";

export class ManageInvitationParamsDto {
  @IsString()
  invitationId!: string;

  @IsString()
  communityId!: string;
}

export class ManageInvitationRequestDto {
  @IsString()
  userId!: string;
}