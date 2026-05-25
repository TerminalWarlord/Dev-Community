import { IsString } from "class-validator";

export class DeleteCommunityDto {
  @IsString()
  communityId!: string;
}