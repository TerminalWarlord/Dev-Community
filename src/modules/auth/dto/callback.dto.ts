import { IsNumber, IsString } from "class-validator";

export class GoogleOAuthCallbackDto {
  @IsNumber()
  userId!: number;

  @IsString()
  accessToken!: string;


  @IsString()
  refreshToken!: string;
}