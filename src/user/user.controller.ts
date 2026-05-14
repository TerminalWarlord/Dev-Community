import { Controller, Delete, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Patch("change-password")
    async changePassword() {
        return this.userService.changePassword();
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
