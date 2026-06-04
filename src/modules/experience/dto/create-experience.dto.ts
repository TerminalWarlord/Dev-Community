import { IsDate, IsString } from "class-validator";

export class CreateExperienceBodyDto {
  @IsString()
  companyName!: string;

  @IsString()
  experienceTitle!: string;

  @IsDate()
  startDate!: string;

  @IsDate()
  endDate!: string;
}

export class CreateExperienceRequestDto {
  @IsString()
  userId!: string;
}