import { IsString } from "class-validator";
import { GetPostsQueriesDto } from "src/modules/post/dto/get-posts.dto";

export class GetUserPostsQueriesDto extends GetPostsQueriesDto {
}

export class GetUserPostsParamsDto{
  @IsString()
  userId!: string
}