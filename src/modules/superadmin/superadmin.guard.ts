import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from 'src/common/user.enum';
import { SuperadminService } from './superadmin.service';

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  private logger = new Logger(SuperadminService.name);
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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
      const user = await this.userModel.findById(
        new mongoose.Types.ObjectId(payload.userId),
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
