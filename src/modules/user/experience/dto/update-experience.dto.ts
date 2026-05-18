import { IsDate, IsString } from "class-validator";

export class UpdateExperienceBodyDto {
  @IsString()
  companyName!: string;

  @IsString()
  userId!: string;

  @IsString()
  experienceTitle!: string;

  @IsDate()
  startDate!: string;

  @IsDate()
  endDate!: string;
}

export class UpdateExperienceRequestDto {
  @IsString()
  userId!: string;
}


export class UpdateExperienceParamsDto {
  @IsString()
  experienceId!: string;
}