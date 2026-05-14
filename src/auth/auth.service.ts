import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/schemas/user.schema';
import bcrypt from "bcrypt";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) { }
    async signUp(
        createUserDto: CreateUserDto
    ) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userModel.insertOne({
            ...createUserDto,
            password: hashedPassword
        });
        if (!user) {
            throw new InternalServerErrorException("Failed to save user");
        }
        return {
            userId: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
        }
    }
    async logIn() {
    }
}
