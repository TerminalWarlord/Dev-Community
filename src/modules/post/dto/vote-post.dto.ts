import { IsNumber, IsOptional, IsString } from "class-validator";
import { VoteType } from "src/common/post.enum";

export class VotePostParamsDto {
  @IsString()
  postSlug!: string;
}

export class VotePostRequestDto {
  @IsNumber()
  userId!: number;
}

export class VotePostBodyDto {
  @IsOptional()
  @IsString()
  voteType!: VoteType;

  @IsOptional()
  @IsNumber()
  communityId!: number;
}