import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RemoveSkillParamsDto, RemoveSkillRequestDto } from './dto/remove-skill.dto';

@Controller('user/skill')
export class SkillController {
  constructor(private skillService: SkillService) { }

  @UseGuards(AuthGuard)
  @Get('get/all')
  async getAllSkills(
    @Request() req: { userId: string }
  ) {
    return this.skillService.getAllSkills(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async addSkill(
    @Body() createSkillDto: CreateSkillDto,
    @Request() req: { userId: string }
  ) {
    return this.skillService.addSkill({ ...createSkillDto, userId: req.userId });
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
