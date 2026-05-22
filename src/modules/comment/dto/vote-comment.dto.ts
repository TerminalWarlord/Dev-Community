import { IsOptional, IsString } from "class-validator";
import { VoteType } from "src/common/post.enum";

export class VoteCommentBodyDto {
  @IsOptional()
  @IsString()
  voteType!: VoteType
}


export class VoteCommentRequestDto {
  @IsString()
  userId!: string;
}


export class VoteCommentParamsDto {
  @IsString()
  commentId!: string;
}
