import { IsString } from "class-validator";
import { UpdatePostBodyDto } from "src/modules/post/dto/update-post.dto";

export class UpdateUserPostBodyDto extends UpdatePostBodyDto{

}

export class UpdateUserPostParamsDto{
  @IsString()
  postSlug!: string;

  @IsString()
  userId!: string;
}

export class UpdateUserPostRequestDto{
  @IsString()
  userId!: string;
}