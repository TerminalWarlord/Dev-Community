import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { CommentService } from './comment.service';


@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // TODO: add guard if users are trying to add/get/update/delete community post comments
  @Get('/comment/:commentId')
  async getComment() {
  }

  @Get('/post/:postSlug/comment/all')
  async getComments() {
  }

  @Post('/post/:postSlug/comment/add')
  async addComment() {
  }

  @Patch('/comment/:commentId/update')
  async updateComment() {
  }

  @Delete('/comment/:commentId/delete')
  async deleteComment() {
  }
}
