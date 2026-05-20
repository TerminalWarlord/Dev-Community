import { Injectable, InternalServerErrorException, Logger, NotFoundException, Request } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Skill } from 'src/schemas/skill.schema';
import { UserSkill } from 'src/schemas/user-skill.schema';
import { CreateSkillDto } from './dto/create-skill.dto';
import { RemoveSkillParamsDto, RemoveSkillRequestDto } from './dto/remove-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';

@Injectable()
export class SkillService {
  private logger = new Logger(SkillService.name);
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
        this.logger.error(err)
        throw new InternalServerErrorException("Failed to create user skill");
      }

    } catch (error) {
      throw new InternalServerErrorException("Failed to create user skill");
    }
  }

  async getAllSkills(getSkillsDto: GetSkillsDto) {
    const page = getSkillsDto.page || 1;
    const limit = getSkillsDto.limit || 10;
    const offset = (page - 1) * limit;
    try {
      const skills = await this.skillModel.find()
        .skip(offset)
        .limit(limit + 1);
      const results = skills.slice(0, limit);
      return {
        results: results,
        hasNextPage: skills.length > limit
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to get skills")
    }
  }


  async removeSkill(removeSkillParamsDto: RemoveSkillParamsDto, removeSkillRequestDto: RemoveSkillRequestDto) {
    try {
      const userSkill = await this.userSkillModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(removeSkillParamsDto.userSkillId),
        userId: new mongoose.Types.ObjectId(removeSkillRequestDto.userId)
      });
      if (!userSkill) {
        throw new NotFoundException("Couldn't find the user skill");
      }
      return {
        message: "success"
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete skill");
    }
  }
}
