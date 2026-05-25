import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { SuperAdminAuthGuard } from './superadmin.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { DeleteCommunityDto } from './dto/delete-community.dto';

@Controller('admin')
export class SuperadminController {
  constructor(private superadminService: SuperadminService) { }

  @UseGuards(SuperAdminAuthGuard)
  @Delete("user/:userId/delete")
  async deleteUser(
    @Param() deleteUserDto: DeleteUserDto
  ) {
    return this.superadminService.deleteUser(deleteUserDto);
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete("post/:postSlug/delete")
  async deletePost(
    @Param() deletePostDto: DeletePostDto
  ) {
    return this.superadminService.deletePost(deletePostDto)
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete("comment/:commentId/delete")
  async deleteComment(
    @Param() deleteCommentDto: DeleteCommentDto
  ) {
    return this.superadminService.deleteComment(deleteCommentDto)
  }

  @UseGuards(SuperAdminAuthGuard)
  @Delete("community/:communityId/delete")
  async deleteCommunity(
    @Param() deleteCommunityDto: DeleteCommunityDto
  ) {
    return this.superadminService.deleteCommunity(deleteCommunityDto)
  }
}
