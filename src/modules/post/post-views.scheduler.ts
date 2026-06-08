import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PostViewSchedulerService implements OnModuleInit {
  constructor(
    @InjectQueue('post-views')
    private readonly postViewsQueue: Queue,
  ) { }

  async onModuleInit() {
    await this.postViewsQueue.add(
      'flush-views',
      {},
      {
        repeat: {
          every: 60000,
        },
        jobId: 'flush-views',
      },
    );
  }
}