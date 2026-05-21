import { IsString } from "class-validator";

export class UpdateCommentParamsDto {
  @IsString()
  commentId!: string;
}

export class UpdateCommentRequestDto {
  @IsString()
  userId!: string;
}

export class UpdateCommentBodyDto {
  @IsString()
  content!: string;
}
