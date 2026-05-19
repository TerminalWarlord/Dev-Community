import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommunityBodyDto{
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description!: string;
}

export class CreateCommunityRequestDto{
  @IsString()
  userId!: string;
}