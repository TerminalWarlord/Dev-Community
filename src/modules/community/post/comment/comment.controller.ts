import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentBodyDto, AddCommentParamsDto, AddCommentRequestDto } from './dto/add-comment.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { GetCommentParamsDto } from './dto/get-comment.dto';
import { GetAllCommentsParamsDto, GetAllCommentsQueriesDto, GetAllCommentsRequestDto } from './dto/get-all-comments.dto';


@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // TODO: add guard if users are trying to add/get/update/delete community post comments
  @Get('/comment/:commentId')
  async getComment(
    @Param() getCommentParamsDto: GetCommentParamsDto
  ) {
    return this.commentService.getComment(
      getCommentParamsDto
    )
  }

  @Get('/post/:postSlug/comment/all')
  async getComments(
    @Query() getAllCommentsQueriesDto: GetAllCommentsQueriesDto,
    @Param() getAllCommentsParamsDto: GetAllCommentsParamsDto,
    @Request() getAllCommentsRequestDto: GetAllCommentsRequestDto,
  ) {
    return this.commentService.getComments(
      getAllCommentsQueriesDto,
      getAllCommentsParamsDto,
      getAllCommentsRequestDto
    )
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
