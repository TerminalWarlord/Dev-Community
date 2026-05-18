import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
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
  @Patch(':experienceId/update')
  async updateExperience(
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Param('experienceId') experienceId: string,
    @Request() req: { userId: string }
  ) {
    return this.experienceService.updateExperience({
      ...updateExperienceDto,
      experienceId,
      userId: req.userId,
    });
  }
  @Delete(':experienceId/delete')
  async removeExperience(
    @Body() removeExperienceDto: RemoveExperienceDto,
    @Param('experienceId') experienceId: string,
    @Request() req: { userId: string }
  ) {
    return this.experienceService.removeExperience({
      ...removeExperienceDto,
      experienceId,
      userId: req.userId,
    });
  }

}
