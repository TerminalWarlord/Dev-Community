import { IsNumber, IsNumberString, IsString } from "class-validator";

export class UpdateCommentParamsDto {
  @IsNumberString()
  commentId!: string;
}

export class UpdateCommentRequestDto {
  @IsNumber()
  userId!: number;
}

export class UpdateCommentBodyDto {
  @IsString()
  content!: string;
}
