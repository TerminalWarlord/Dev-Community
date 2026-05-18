import { IsDate, IsString } from "class-validator";

export class UpdateExperienceDto {
  @IsString()
  experienceId!: string;

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