import { IsNumberString } from "class-validator";

export class RemoveSkillParamsDto {
  @IsNumberString()
  userSkillId!: string;
}

export class RemoveSkillRequestDto {
  @IsNumberString()
  userId!: string;
}

