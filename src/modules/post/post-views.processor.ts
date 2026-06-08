import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bullmq";
import Redis from "ioredis";
import { Post } from "src/entities/post.entity";
import { Repository } from "typeorm";

@Processor('post-views')
export class PostViewProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {
    super();
  }
  async process(job: Job) {
    if (job.name !== 'flush-views') {
      return;
    }
    const keys = await this.redis.keys('post:*:views');
    for (const key of keys) {
      const count = await this.redis.getdel(key);
      if (!count) {
        continue;
      }
      const [, postId] = key.split(':');
      await this.postRepo.increment(
        { id: Number(postId) },
        'views',
        Number(count),
      );
    }
  }
}