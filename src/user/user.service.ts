import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }
    async changePassword(
        changePasswordDto: ChangePasswordDto,
        userId: string,
    ) {
        if (!userId) {
            throw new UnauthorizedException();
        }
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId));
        if (!user) {
            throw new UnauthorizedException();
        }
        try {
            const passwordMatches = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
            if (!passwordMatches) {
                throw new ForbiddenException("Old password is incorrect");
            }
            const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
            try {
                await this.userModel.updateOne({ _id: user._id }, {
                    password: hashedPassword
                });
                return {
                    message: "You've successfully changed your password",
                }
            }
            catch (err) {
                throw new InternalServerErrorException("Failed to update user password");
            }
        }
        catch (err) {
            throw new ForbiddenException("Old password is incorrect");
        }
    }
    async addSkill() {
    }
    async removeSkill() {
    }
    async addExperience() {
    }
    async updateExperience() {
    }
    async removeExperience() {
    }
    async acceptInvitation() {
    }
    async rejectInvitation() {
    }
}
