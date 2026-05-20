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
import { JWT_SECRET } from 'src/common/constants';
import { MembershipStatus } from 'src/common/community.enum';
import { CommunityService } from '../community.service';

@Injectable()
export class CommunityMembershipAuthGuard implements CanActivate {
  private logger = new Logger(CommunityService.name);
  constructor(
    @InjectModel(CommunityRole.name)
    private readonly communityRoleModel: Model<CommunityRole>,
    private readonly jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      if (!payload.userId) {
        throw new UnauthorizedException();
      }
      // extract params
      const communityId = request.params.communityId;
      if (!communityId) {
        throw new UnauthorizedException();
      }
      // check if userId
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
