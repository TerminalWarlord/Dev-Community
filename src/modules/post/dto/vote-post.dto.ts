import { IsOptional, IsString } from "class-validator";
import { VoteType } from "src/common/post.enum";

export class VotePostParamsDto {
  @IsString()
  postSlug!: string;
}

export class VotePostRequestDto {
  @IsString()
  userId!: string;
}

export class VotePostBodyDto {
  @IsOptional()
  @IsString()
  voteType!: VoteType;

  @IsOptional()
  @IsString()
  communityId!: string;
}