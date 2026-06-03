import { IsNumber, IsNumberString, } from "class-validator";

export class DeleteCommunityParamsDto {
  @IsNumberString()
  communityId!: string;
}

export class DeleteCommunityRequestDto {
  @IsNumber()
  userId!: number;
}