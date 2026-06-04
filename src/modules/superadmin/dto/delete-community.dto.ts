import { IsNumberString, IsString } from "class-validator";

export class DeleteCommunityDto {
  @IsNumberString()
  communityId!: string;
}