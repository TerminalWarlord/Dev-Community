import { Injectable, InternalServerErrorException, Logger, NotFoundException, Request } from '@nestjs/common';
import { CreateSkillBodyDto, CreateSkillRequestDto } from './dto/create-skill.dto';
import { RemoveSkillParamsDto, RemoveSkillRequestDto } from './dto/remove-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from 'src/entities/skill.entity';
import { Repository } from 'typeorm';
import { UserSkill } from 'src/entities/user-skill.entity';

@Injectable()
export class SkillService {
  private logger = new Logger(SkillService.name);
  constructor(
    // @InjectModel(Skill.name)
    // private readonly skillModel: Model<Skill>,
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepo: Repository<UserSkill>,
  ) { }
  async addSkill(
    createSkillDto: CreateSkillBodyDto,
    createSkillRequestDto: CreateSkillRequestDto
  ) {
    let skill;
    try {
      skill = await this.skillRepo.findOne({
        where: {
          skillTitle: createSkillDto.skillTitle
        }
      });
      if (!skill) {
        const newSkill = this.skillRepo.create({
          skillTitle: createSkillDto.skillTitle
        });
        skill = await this.skillRepo.save(newSkill);
      }
      if (!skill) {
        throw new InternalServerErrorException("Failed to create skill");
      }
      try {
        // const userSkill = await this.userSkillModel.insertOne({
        //   userId: new mongoose.Types.ObjectId(createSkillDto.userId),
        //   skillId: skill._id
        // });

        const userSkill = await this.userSkillRepo.create({
          skill,
          user: {
            id: createSkillRequestDto.userId
          }
        })

        return {
          message: "success",
          user_skill_id: userSkill.id
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
    // const page = getSkillsDto.page || 1;
    // const limit = getSkillsDto.limit || 10;
    // const offset = (page - 1) * limit;
    // try {
    //   const skills = await this.skillModel.find()
    //     .skip(offset)
    //     .limit(limit + 1);
    //   const results = skills.slice(0, limit);
    //   return {
    //     results: results,
    //     hasNextPage: skills.length > limit
    //   };
    // } catch (error) {
    //   throw new InternalServerErrorException("Failed to get skills")
    // }
  }


  async removeSkill(removeSkillParamsDto: RemoveSkillParamsDto, removeSkillRequestDto: RemoveSkillRequestDto) {
    //   try {
    //     const userSkill = await this.userSkillModel.findOneAndDelete({
    //       _id: new mongoose.Types.ObjectId(removeSkillParamsDto.userSkillId),
    //       userId: new mongoose.Types.ObjectId(removeSkillRequestDto.userId)
    //     });
    //     if (!userSkill) {
    //       throw new NotFoundException("Couldn't find the user skill");
    //     }
    //     return {
    //       message: "success"
    //     };
    //   } catch (error) {
    //     throw new InternalServerErrorException("Failed to delete skill");
    //   }
  }
}
