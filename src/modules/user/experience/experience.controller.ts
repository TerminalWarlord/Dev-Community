import { Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';


@Controller('user/experience')
export class ExperienceController {
  constructor(
    private experienceService: ExperienceService
  ) { }

  @UseGuards(AuthGuard)
  @Post('add')
  async addExperience(
    @Body() createExperienceDto: CreateExperienceDto,
    @Request() req: {userId: string}
  ) {
    return this.experienceService.addExperience({...createExperienceDto, userId: req.userId});
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
