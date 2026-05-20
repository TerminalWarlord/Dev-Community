import { IsString } from "class-validator";

export class GetUserPost {
  @IsString()
  postSlug!: string;
}