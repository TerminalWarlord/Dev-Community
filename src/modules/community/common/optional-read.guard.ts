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
import mongoose, { Model } from 'mongoose';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { MembershipStatus } from 'src/common/community.enum';
import { CommunityService } from '../community.service';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OptionalReadAccessGuard implements CanActivate {
  private logger = new Logger(CommunityService.name);
  constructor(
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService, private configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
    if (!token) {
      return true;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      if (payload.userId) {
        const user = await this.userModel.find({
          _id: new mongoose.Types.ObjectId(payload.userId)
        });
        if (!user) {
          throw new UnauthorizedException();
        }
        request["userId"] = payload.userId;
      }

      // extract communityId from body or queries
      const communityId = request.body?.communityId ?? request.query?.communityId;
      if (communityId) {
        if (!request["userId"]) {
          throw new UnauthorizedException("You are not a member of this community!");
        }
        const communityRole = await this.communityRoleModel.findOne({
          userId: new mongoose.Types.ObjectId(payload.userId),
          communityId: new mongoose.Types.ObjectId(communityId),
        });
        if (!communityRole) {
          throw new UnauthorizedException("You are not a member of this community!");
        }
        if (communityRole.status === MembershipStatus.BANNED) {
          throw new UnauthorizedException("You are banned from the community!");
        }
      }
    } catch (err) {
      this.logger.error(err);
      if (err instanceof Error) {
        throw new UnauthorizedException(err.message);
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
