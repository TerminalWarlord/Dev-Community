import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';


@Controller('post/:postSlug/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get()
  async getCommunityPostComment() {
  }
  @Get('all')
  async getCommunityPostComments() {
  }

  @Post('add')
  async addACommunityPostComment() {
  }

  @Patch('update')
  async updateACommunityPostComment() {
  }

  @Delete('delete')
  async deleteACommunityPostComment() {
  }
}
