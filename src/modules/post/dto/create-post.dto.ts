import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostBodyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  content!: string;

  @IsOptional()
  @IsString()
  communityId!: string;

  @IsOptional()
  @IsDateString()
  publishAt!: string
}


export class CreatePostRequestDto {
  @IsNumber()
  userId!: number;
}