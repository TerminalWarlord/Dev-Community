import { IsNumberString, IsString } from "class-validator";

export class ChangePasswordBodyDto {
  @IsString()
  oldPassword!: string;
  
  @IsString()
  newPassword!: string;
}


export class ChangePasswordRequestDto {
  @IsNumberString()
  userId!: string;
}