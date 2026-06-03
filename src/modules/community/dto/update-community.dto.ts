import { IsDefined, IsNumber, IsNumberString, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

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
  @IsNumber()
  userId!: number;
}

export class UpdateCommunityParamsDto{
  @IsNumberString()
  communityId!: string;
}