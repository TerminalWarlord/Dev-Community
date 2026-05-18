import { IsString } from "class-validator";

export class DeleteCommunityParamsDto {
  @IsString()
  communityId!: string;
}

export class DeleteCommunityRequestDto {
  @IsString()
  userId!: string;
}