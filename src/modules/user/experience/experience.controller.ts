import { Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RemoveExperienceDto } from './dto/remove-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';


@UseGuards(AuthGuard)
@Controller('user/experience')
export class ExperienceController {
  constructor(
    private experienceService: ExperienceService
  ) { }

  @Post('add')
  async addExperience(
    @Body() createExperienceDto: CreateExperienceDto,
    @Request() req: { userId: string }
  ) {
    return this.experienceService.addExperience({ ...createExperienceDto, userId: req.userId });
  }
  @Patch('update')
  async updateExperience(
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Request() req: { userId: string }
  ) {
    return this.experienceService.updateExperience({ ...updateExperienceDto, userId: req.userId });
  }
  @Delete('delete')
  async removeExperience(
    @Body() removeExperienceDto: RemoveExperienceDto,
    @Request() req: { userId: string }
  ) {
    return this.experienceService.removeExperience({ ...removeExperienceDto, userId: req.userId });
  }

}
