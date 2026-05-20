import { IsBoolean, IsString } from "class-validator";

export class VotePostParamsDto {
  @IsString()
  postSlug!: string;
}

export class VotePostRequestDto {
  @IsString()
  userId!: string;
}

export class VotePostBodyDto {
  @IsBoolean()
  isUpvote!: boolean;
}