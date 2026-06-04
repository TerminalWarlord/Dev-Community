import { IsDefined, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class UpdatePostBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  content!: string;

  @IsOptional()
  @IsNumberString()
  communityId!: string;

  @ValidateIf(d => !d.title && !d.content)
  @IsDefined({
    message: "At least a value of title or content must be provided"
  })
  protected readonly atLeastOne: undefined;
}

export class UpdatePostParamsDto {
  @IsString()
  postSlug!: string;
}


export class UpdatePostRequestDto {
  @IsNumber()
  userId!: number;
}