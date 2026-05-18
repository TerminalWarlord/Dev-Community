import { IsDefined, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class UpdateCommunityBodyDto{
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(1000)
  description!: string;

  @ValidateIf((d)=>!d.name&&!d.description)
  @IsDefined({
    message: "At least a value of name or description must be provided"
  })
  protected readonly atLeastOne: undefined;
}

export class UpdateCommunityRequestDto{
  @IsString()
  userId!: string;
}

export class UpdateCommunityParamsDto{
  @IsString()
  communityId!: string;
}