import { IsString } from "class-validator";

export class GetPostParamsDto {
  @IsString()
  communityId!: string;

  @IsString()
  postSlug!: string;
}