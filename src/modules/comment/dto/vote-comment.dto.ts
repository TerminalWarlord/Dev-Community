import { IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { VoteType } from "src/common/post.enum";

export class VoteCommentBodyDto {
  @IsOptional()
  @IsEnum(VoteType)
  voteType!: VoteType
}


export class VoteCommentRequestDto {
  @IsNumber()
  userId!: number;
}


export class VoteCommentParamsDto {
  @IsNumberString()
  commentId!: string;
}
