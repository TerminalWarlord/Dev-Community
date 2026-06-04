import { IsDate, IsDateString, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateExperienceBodyDto {
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

export class CreateExperienceRequestDto {
  @IsNumberString()
  userId!: string;
}