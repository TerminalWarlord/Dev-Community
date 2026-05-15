import { Controller, Delete, Post } from '@nestjs/common';
import { SkillService } from './skill.service';

@Controller('user/skill')
export class SkillController {
  constructor(private skillService: SkillService) {}
  @Post('add')
  async addSkill() {
    return this.skillService.addSkill();
  }
  @Delete('delete')
  async removeSkill() {
    return this.skillService.removeSkill();
  }
}
