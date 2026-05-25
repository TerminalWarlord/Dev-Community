import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperAdminAuthGuard } from './superadmin.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';

@Controller('superadmin')
export class SuperadminController {
  constructor(private superadminService: SuperadminService) { }

  @UseGuards(SuperAdminAuthGuard)
  @Delete()
  async deleteUser(
    @Param() deleteUserDto: DeleteUserDto
  ) {
    return this.superadminService.deleteUser(deleteUserDto);
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete()
  async deletePost(
    @Param() deletePostDto: DeletePostDto
  ) {
    return this.superadminService.deletePost(deletePostDto)
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete()
  async deleteComment(
    @Param() deleteCommentDto: DeleteCommentDto
  ) {
    return this.superadminService.deleteComment(deleteCommentDto)
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete()
  async deleteCommunity() {

  }
}
