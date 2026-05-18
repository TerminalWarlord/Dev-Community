import { IsString } from "class-validator";

export class RemoveSkillParamsDto {
  @IsString()
  userSkillId!: string;
}

export class RemoveSkillRequestDto {
  @IsString()
  userId!: string;
}

