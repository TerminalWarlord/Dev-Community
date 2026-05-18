import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Experience } from 'src/schemas/experience.schema';
import { CreateExperienceBodyDto, CreateExperienceRequestDto } from './dto/create-experience.dto';
import { UpdateExperienceBodyDto, UpdateExperienceParamsDto, UpdateExperienceRequestDto } from './dto/update-experience.dto';
import { RemoveExperienceParamsDto, RemoveExperienceRequestDto } from './dto/remove-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,
  ) { }

  async addExperience(
    createExperienceBodyDto: CreateExperienceBodyDto,
    createExperienceRequestDto: CreateExperienceRequestDto
  ) {
    try {
      const experience = await this.experienceModel.insertOne({
        ...createExperienceBodyDto,
        userId: new mongoose.Types.ObjectId(createExperienceRequestDto.userId)
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

  async updateExperience(
    updateExperienceBodyDto: UpdateExperienceBodyDto,
    updateExperienceParamsDto: UpdateExperienceParamsDto,
    updateExperienceRequestDto: UpdateExperienceRequestDto
  ) {
    try {
      const experience = await this.experienceModel.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(updateExperienceParamsDto.experienceId),
        userId: new mongoose.Types.ObjectId(updateExperienceRequestDto.userId),
      }, {
        ...updateExperienceBodyDto,
        userId: new mongoose.Types.ObjectId(updateExperienceRequestDto.userId),
      })

      if (!experience) {
        throw new NotFoundException("Experience doesn't exist");
      }
      return {
        message: "success",
      }

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Failed to update experience");
    }
  }

  async removeExperience(
    removeExperienceParamsDto: RemoveExperienceParamsDto,
    removeExperienceRequestDto: RemoveExperienceRequestDto
  ) {
    try {
      const experience = await this.experienceModel.findOneAndDelete({
        userId: new mongoose.Types.ObjectId(removeExperienceRequestDto.userId),
        _id: new mongoose.Types.ObjectId(removeExperienceParamsDto.experienceId)
      })
      if (!experience) {
        throw new NotFoundException("Experience doesn't exist");
      }
      return {
        message: "success"
      }
    }
    catch (err) {
      console.log(err)
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
      else {
        throw new InternalServerErrorException("Failed to delete experience");
      }
    }
  }
}
