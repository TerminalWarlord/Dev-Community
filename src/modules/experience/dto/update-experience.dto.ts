import { IsDate, IsDateString, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateExperienceBodyDto {
  @IsString()
  companyName!: string;

  @IsString()
  experienceTitle!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate!: string;
}

export class UpdateExperienceRequestDto {
  @IsNumber()
  userId!: number;
}


export class UpdateExperienceParamsDto {
  @IsNumberString()
  experienceId!: string;
}