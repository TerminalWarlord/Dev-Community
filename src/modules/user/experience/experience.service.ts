import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Experience } from 'src/schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { RemoveExperienceDto } from './dto/remove-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

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

  async updateExperience(updateExperienceDto: UpdateExperienceDto) {
    try {
      await this.experienceModel.updateOne({
        _id: updateExperienceDto.experienceId,
        userId: new mongoose.Types.ObjectId(updateExperienceDto.experienceId),
      }, {
        ...updateExperienceDto
      })
      return {
        message: "success"
      }

    } catch (error) {
      throw new InternalServerErrorException("Failed to update experience");
    }
  }
  async removeExperience(removeExperienceDto: RemoveExperienceDto) {
    try {
      const experience = await this.experienceModel.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(removeExperienceDto.userId),
        _id: new mongoose.Types.ObjectId(removeExperienceDto.experienceId)
      })
      if (!experience) {
        throw new InternalServerErrorException("Failed to delete experience");
      }
      return {
        message: "success"
      }
    }
    catch (err) {
      throw new InternalServerErrorException("Failed to delete experience");
    }
  }
}
