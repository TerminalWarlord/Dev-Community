import { IsNumberString } from "class-validator";

export class GetCommentParamsDto {
  @IsNumberString()
  commentId!: string;
}