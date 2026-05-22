import { IsString } from "class-validator";
import { CreatePostBodyDto } from "src/modules/post/dto/create-post.dto";

export class AddUserPostDto extends CreatePostBodyDto {
}


export class AddUserPostRequestDto {
  @IsString()
  userId!: string;
}