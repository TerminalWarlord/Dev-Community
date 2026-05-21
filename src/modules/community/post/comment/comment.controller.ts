import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentBodyDto, AddCommentParamsDto, AddCommentRequestDto } from './dto/add-comment.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';


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

  @UseGuards(AuthGuard)
  @Post('/post/:postSlug/comment/add')
  async addComment(
    @Body() addCommentBodyDto: AddCommentBodyDto,
    @Param() addCommentParamsDto: AddCommentParamsDto,
    @Request() addCommentRequestDto: AddCommentRequestDto,
  ) {
    return this.commentService.addComment(
      addCommentBodyDto,
      addCommentParamsDto,
      addCommentRequestDto
    )
  }

  @Patch('/comment/:commentId/update')
  async updateComment() {
  }

  @Delete('/comment/:commentId/delete')
  async deleteComment() {
  }
}
