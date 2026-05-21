import { IsString } from "class-validator";

export class GetCommentParamsDto {
  @IsString()
  commentId!: string;
}