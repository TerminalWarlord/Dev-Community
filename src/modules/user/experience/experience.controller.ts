import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ExperienceService } from './experience.service';


@Controller('user/experience')
export class ExperienceController {
  constructor(
    private experienceService: ExperienceService
  ) { }

  @Post('add')
  async addExperience() {
    return this.experienceService.addExperience();
  }
  @Patch('update')
  async updateExperience() {
    return this.experienceService.updateExperience();
  }
  @Delete('delete')
  async removeExperience() {
    return this.experienceService.removeExperience();
  }

}
