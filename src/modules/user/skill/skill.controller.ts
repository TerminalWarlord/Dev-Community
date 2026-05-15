import { Body, Controller, Delete, Get, Post, Request, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';

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
  @Delete('delete')
  async removeSkill() {
    return this.skillService.removeSkill();
  }
}
