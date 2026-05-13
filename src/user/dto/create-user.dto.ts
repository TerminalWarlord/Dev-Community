import mongoose from "mongoose"

export class CreateUserDto {
    _id!: mongoose.Types.ObjectId;
    fname!: string;
    lname!: string;
    email!: string;
    password!: string;
    created_at!: Date;
    updated_at!: Date;
}