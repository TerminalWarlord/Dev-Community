import { Controller } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {
    }
}
