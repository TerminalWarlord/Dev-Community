import { IsString } from "class-validator";

export class DeleteUserPostParamsDto {
  @IsString()
  postSlug!: string;

  @IsString()
  userId!: string;
}

export class DeleteUserPostRequestDto {
  @IsString()
  userId!: string;
}