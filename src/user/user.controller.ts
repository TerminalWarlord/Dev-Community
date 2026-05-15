import { Body, Controller, Delete, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @UseGuards(AuthGuard)
    @Patch("change-password")
    async changePassword(
        @Body() changePasswordDto: ChangePasswordDto,
        @Request() req: { userId: string }
    ) {
        return this.userService.changePassword(changePasswordDto, req.userId);
    }
    // TODO: add new module for skill, experience, invitation
    @Post("skill/add")
    async addSkill() {
        return this.userService.addSkill();
    }
    @Delete("skill/delete")
    async removeSkill() {
        return this.userService.removeSkill();
    }
    @Post("experience/add")
    async addExperience() {
        return this.userService.addExperience();
    }
    @Patch("experience/update")
    async updateExperience() {
        return this.userService.updateExperience();
    }
    @Delete("experience/delete")
    async removeExperience() {
        return this.userService.removeExperience();
    }
    @Post("invitation/accept/:invitationId")
    async acceptInvitation() {
        return this.userService.acceptInvitation();
    }
    @Post("invitation/reject/:invitationId")
    async rejectInvitation() {
        return this.userService.rejectInvitation();
    }
}
