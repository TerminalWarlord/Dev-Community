import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AddCommentBodyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  content!: string;

  @IsOptional()
  @IsNumber()
  parentId!: number;
}

export class AddCommentParamsDto {
  @IsString()
  postSlug!: string;
}


export class AddCommentRequestDto {
  @IsNumber()
  userId!: number;
}