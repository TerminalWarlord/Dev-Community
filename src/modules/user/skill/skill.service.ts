import { Body, Injectable, InternalServerErrorException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Skill } from 'src/schemas/skill.schema';
import { UserSkill } from 'src/schemas/user-skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<Skill>,
    @InjectModel(UserSkill.name)
    private readonly userSkillModel: Model<UserSkill>,
  ) { }
  async addSkill(
    createSkillDto: CreateSkillDto
  ) {
    try {
      let skill = await this.skillModel.findOne({
        skillTitle: createSkillDto.skillTitle
      });
      if (!skill) {
        skill = await this.skillModel.insertOne({
          skillTitle: createSkillDto.skillTitle
        });
      }
      if (!skill) {
        throw new InternalServerErrorException("Failed to create skill");
      }
      try {
        const userSkill = await this.userSkillModel.insertOne({
          userId: new mongoose.Types.ObjectId(createSkillDto.userId),
          skillId: skill._id
        });
        return {
          message: "success",
          user_skill_id: userSkill._id
        }
      }
      catch (err) {
        console.log(err)
        throw new InternalServerErrorException("Failed to create user skill");
      }

    } catch (error) {
      throw new InternalServerErrorException("Failed to create user skill");
    }
  }

  // TODO: add pagination
  async getAllSkills(userId: string) {
    const userSkills = await this.userSkillModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).populate("skillId");
    return userSkills;
  }
  async removeSkill() {
    return {};
  }
}
