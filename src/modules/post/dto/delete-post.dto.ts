import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class DeletePostBodyDto {
  @IsOptional()
  @IsNumberString()
  communityId!: string;
}


export class DeletePostParamsDto {
  @IsString()
  postSlug!: string;
}


export class DeletePostRequestDto {
  @IsNumber()
  userId!: number;
}