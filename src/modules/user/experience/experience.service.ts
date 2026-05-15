import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience } from 'src/schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,
  ) { }

  // TODO: check duplicates
  async addExperience(createExperienceDto: CreateExperienceDto) {
    try {
      const experience = await this.experienceModel.insertOne({
        ...createExperienceDto,
        startDate: new Date(createExperienceDto.startDate),
        endDate: new Date(createExperienceDto.endDate),
      })
      return {
        message: "success",
        experienceId: experience._id
      };

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Failed to create experience");
    }
  }

  async updateExperience() {
    return {}
  }
  async removeExperience() {
    return {}
  }
}
