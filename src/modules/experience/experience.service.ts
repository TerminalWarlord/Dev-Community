import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateExperienceBodyDto, CreateExperienceRequestDto } from './dto/create-experience.dto';
import { UpdateExperienceBodyDto, UpdateExperienceParamsDto, UpdateExperienceRequestDto } from './dto/update-experience.dto';
import { RemoveExperienceParamsDto, RemoveExperienceRequestDto } from './dto/remove-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from 'src/entities/experience.entity';



@Injectable()
export class ExperienceService {
  private logger = new Logger(ExperienceService.name);
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>
  ) { }

  async addExperience(
    createExperienceBodyDto: CreateExperienceBodyDto,
    createExperienceRequestDto: CreateExperienceRequestDto
  ) {
    try {
      const endDate = createExperienceBodyDto.endDate?new Date(createExperienceBodyDto.endDate):undefined;
      const experience = await this.experienceRepo.save(this.experienceRepo.create({
        user: {
          id: parseInt(createExperienceRequestDto.userId)
        },
        ...createExperienceBodyDto,
        startDate: new Date(createExperienceBodyDto.startDate),
        endDate: endDate,
      }))
      return {
        message: "success",
        experienceId: experience.id
      };

    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException("Failed to create experience");
    }
  }

  async updateExperience(
    updateExperienceBodyDto: UpdateExperienceBodyDto,
    updateExperienceParamsDto: UpdateExperienceParamsDto,
    updateExperienceRequestDto: UpdateExperienceRequestDto
  ) {
    // try {
    //   const experience = await this.experienceModel.findOneAndUpdate({
    //     _id: new mongoose.Types.ObjectId(updateExperienceParamsDto.experienceId),
    //     userId: new mongoose.Types.ObjectId(updateExperienceRequestDto.userId),
    //   }, {
    //     ...updateExperienceBodyDto,
    //     userId: new mongoose.Types.ObjectId(updateExperienceRequestDto.userId),
    //   })

    //   if (!experience) {
    //     throw new NotFoundException("Experience doesn't exist");
    //   }
    //   return {
    //     message: "success",
    //   }

    // } catch (error) {
    //   this.logger.error(error)
    //   throw new InternalServerErrorException("Failed to update experience");
    // }
  }

  async removeExperience(
    removeExperienceParamsDto: RemoveExperienceParamsDto,
    removeExperienceRequestDto: RemoveExperienceRequestDto
  ) {
    // try {
    //   const experience = await this.experienceModel.findOneAndDelete({
    //     userId: new mongoose.Types.ObjectId(removeExperienceRequestDto.userId),
    //     _id: new mongoose.Types.ObjectId(removeExperienceParamsDto.experienceId)
    //   })
    //   if (!experience) {
    //     throw new NotFoundException("Experience doesn't exist");
    //   }
    //   return {
    //     message: "success"
    //   }
    // }
    // catch (err) {
    //   this.logger.error(err)
    //   if (err instanceof Error) {
    //     throw new InternalServerErrorException(err.message);
    //   }
    //   else {
    //     throw new InternalServerErrorException("Failed to delete experience");
    //   }
    // }
  }
}
