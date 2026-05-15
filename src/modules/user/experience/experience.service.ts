import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experience } from 'src/schemas/experience.schema';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,
  ) { }

  async addExperience() {
    return {}
  }

  async updateExperience() {
    return {}
  }
  async removeExperience() {
    return {}
  }
}
