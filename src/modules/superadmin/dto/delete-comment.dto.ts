import { IsNumberString, IsString } from "class-validator";

export class DeleteCommentDto {
  @IsNumberString()
  commentId!: string;
}