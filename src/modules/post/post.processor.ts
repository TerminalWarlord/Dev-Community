import { Processor, WorkerHost } from "@nestjs/bullmq";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bullmq";
import { formatDate } from "src/common/format-date";
import { PostStatus } from "src/common/post.enum";
import { Post } from "src/entities/post.entity";
import { Repository } from "typeorm";

@Processor('posts')
export class PostProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>
  ) {
    super();
    console.log("WORKER instantiated")
  }
  async process(job: Job): Promise<any> {
    const { postId } = job.data;
    const post = await this.postRepo.findOne({
      where: {
        id: parseInt(postId)
      }
    });
    if (!post) {
      return;
    }
    if (post.status === PostStatus.SCHEDULED) {
      await this.postRepo.update(
        {
          id: parseInt(postId)
        },
        {
          status: PostStatus.PUBLISHED,
          publishAt: formatDate((new Date()).toDateString()),
        },
      );
    }
  }
}