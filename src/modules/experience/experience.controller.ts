import { Body, Controller, Delete, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceBodyDto, CreateExperienceRequestDto } from './dto/create-experience.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { UpdateExperienceBodyDto, UpdateExperienceParamsDto, UpdateExperienceRequestDto } from './dto/update-experience.dto';
import { RemoveExperienceParamsDto, RemoveExperienceRequestDto } from './dto/remove-experience.dto';


@UseGuards(AuthGuard)
@Controller('user/experience')
export class ExperienceController {
  constructor(
    private experienceService: ExperienceService
  ) { }

  @Post('add')
  async addExperience(
    @Body() createExperienceBodyDto: CreateExperienceBodyDto,
    @Request() createExperienceRequestDto: CreateExperienceRequestDto
  ) {
    return this.experienceService.addExperience(createExperienceBodyDto, createExperienceRequestDto);
  }

  @Patch(':experienceId/update')
  async updateExperience(
    @Body() updateExperienceBodyDto: UpdateExperienceBodyDto,
    @Param() updateExperienceParamsDto: UpdateExperienceParamsDto,
    @Request() updateExperienceRequestDto: UpdateExperienceRequestDto
  ) {
    return this.experienceService.updateExperience(
      updateExperienceBodyDto,
      updateExperienceParamsDto,
      updateExperienceRequestDto
    );
  }

  @Delete(':experienceId/delete')
  async removeExperience(
    @Param() removeExperienceParamsDto: RemoveExperienceParamsDto,
    @Request() removeExperienceRequestDto: RemoveExperienceRequestDto
  ) {
    return this.experienceService.removeExperience(
      removeExperienceParamsDto,
      removeExperienceRequestDto
    );
  }

}
