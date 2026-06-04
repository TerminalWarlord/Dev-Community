import { IsString } from "class-validator";

export class RemoveExperienceParamsDto {
  @IsString()
  experienceId!: string;
}

export class RemoveExperienceRequestDto {
  @IsString()
  userId!: string;
}
