import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';
import { GoogleAuthGuard } from './utils/google-auth.guard';
import { GoogleOAuthCallbackDto } from './dto/callback.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  async logIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.logIn(loginUserDto);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {
    return {};
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleRedirect(@Request() req: { user: GoogleOAuthCallbackDto }) {
    return req.user;
  }
}
