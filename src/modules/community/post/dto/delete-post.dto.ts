import { IsString } from "class-validator";

export class DeletePostParamsDto {
  @IsString()
  communityId!: string;

  @IsString()
  postSlug!: string;
}


export class DeletePostRequestDto {
  @IsString()
  userId!: string;
}