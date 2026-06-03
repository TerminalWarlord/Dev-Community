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
import { MembershipStatus } from 'src/common/community.enum';
import { CommunityService } from '../community.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityRole } from 'src/entities/community-role.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class OptionalReadAccessGuard implements CanActivate {
  private logger = new Logger(CommunityService.name);
  constructor(
    @InjectRepository(CommunityRole)
    private readonly communityRoleRepo: Repository<CommunityRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
        const userId = parseInt(payload.userId);
        if (!userId || Number.isNaN(userId)) {
          throw new BadRequestException("Please provide a valid userId")
        }
        const user = await this.userRepo.find({
          where: {
            id: userId
          }
        });
        if (!user) {
          throw new UnauthorizedException("Invalid user");
        }
        request["userId"] = parseInt(payload.userId);
      }

      // extract communityId from body or queries
      const communityId = request.body?.communityId ?? request.query?.communityId;
      if (communityId) {
        const parsedCommunityId = parseInt(communityId);
        if (Number.isNaN(parsedCommunityId)) {
          throw new BadRequestException("Invalid community!")
        }
        if (!request["userId"]) {
          throw new UnauthorizedException("You are not a member of this community!");
        }
        const communityRole = await this.communityRoleRepo.findOne({
          where: {
            user: {
              id: parseInt(payload.userId)
            },
            community: {
              id: communityId
            }
          }
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
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
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
