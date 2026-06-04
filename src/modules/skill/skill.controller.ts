import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RemoveSkillParamsDto, RemoveSkillRequestDto } from './dto/remove-skill.dto';
import { GetSkillsDto } from './dto/get-skills.dto';
import { CreateSkillBodyDto, CreateSkillRequestDto } from './dto/create-skill.dto';

@Controller('user/skill')
export class SkillController {
  constructor(private skillService: SkillService) { }

  @Get('get/all')
  async getAllSkills(
    @Query() getSkillsDto: GetSkillsDto
  ) {
    return this.skillService.getAllSkills(getSkillsDto);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async addSkill(
    @Body() createSkillDto: CreateSkillBodyDto,
    @Request() createSkillRequestDto: CreateSkillRequestDto
  ) {
    return this.skillService.addSkill(createSkillDto, createSkillRequestDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':userSkillId/delete')
  async removeSkill(
    @Param() removeSkillParamsDto: RemoveSkillParamsDto,
    @Request() removeSkillRequestDto: RemoveSkillRequestDto
  ) {
    return this.skillService.removeSkill(removeSkillParamsDto, removeSkillRequestDto);
  }
}
