import { IsNumber, IsNumberString, IsString } from "class-validator";

export class RemoveExperienceParamsDto {
  @IsNumberString()
  experienceId!: string;
}

export class RemoveExperienceRequestDto {
  @IsNumber()
  userId!: number;
}
