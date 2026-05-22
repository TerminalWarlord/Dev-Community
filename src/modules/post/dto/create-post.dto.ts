import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
}


export class CreatePostRequestDto {
  @IsString()
  userId!: string;
}