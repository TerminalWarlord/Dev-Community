import { Processor, WorkerHost } from "@nestjs/bullmq";
import { InjectModel } from "@nestjs/mongoose";
import { Job } from "bullmq";
import { Model } from "mongoose";
import { PostStatus } from "src/common/post.enum";
import { Post } from "src/schemas/post.schema";

@Processor('posts')
export class PostProcessor extends WorkerHost {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>
  ) {
    super();
    console.log("WORKER instantiated")
  }
  async process(job: Job): Promise<any> {
    const { postId } = job.data;
    const post = await this.postModel.findById(postId);
    if (!post) {
      return;
    }
    if (post.status === PostStatus.SCHEDULED) {
      await this.postModel.findByIdAndUpdate(
        postId,
        {
          status: PostStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      );
    }
  }
}