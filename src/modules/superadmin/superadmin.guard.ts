import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from 'src/common/user.enum';
import { SuperadminService } from './superadmin.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  private logger = new Logger(SuperadminService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const JWT_SECRET = this.configService.get<string>("JWT_SECRET");
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      process.exit(1);
    }
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      const userId = parseInt(payload.userId);
      if (Number.isNaN(userId)) {
        throw new BadRequestException("Invalid user")
      }
      const user = await this.userRepo.findOne({
        where: { id: userId }
      }
      );
      if (!user || user.status !== UserStatus.SUPERADMIN) {
        throw new UnauthorizedException();
      }
      request['userId'] = payload.userId;
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
