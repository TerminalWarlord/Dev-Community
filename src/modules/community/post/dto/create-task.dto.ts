import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskBodyDto {
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  content!: string;
}

export class CreateTaskParamsDto {
  @IsString()
  communityId!: string;
}


export class CreateTaskRequestDto {
  @IsString()
  userId!: string;
}