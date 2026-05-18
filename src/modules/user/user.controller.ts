import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req: { userId: string },
  ) {
    return this.userService.changePassword(changePasswordDto, req.userId);
  }
  // TODO: add new module for skill, experience, invitation
  @Post('invitation/accept/:invitationId')
  async acceptInvitation() {
    return this.userService.acceptInvitation();
  }
  @Post('invitation/reject/:invitationId')
  async rejectInvitation() {
    return this.userService.rejectInvitation();
  }
}
