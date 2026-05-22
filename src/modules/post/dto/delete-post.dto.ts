import { IsOptional, IsString } from "class-validator";

export class DeletePostBodyDto {
  @IsOptional()
  @IsString()
  communityId!: string;
}


export class DeletePostParamsDto {
  @IsString()
  postSlug!: string;
}


export class DeletePostRequestDto {
  @IsString()
  userId!: string;
}