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

@Injectable()
export class CommunityMembershipAuthGuard implements CanActivate {
  private logger = new Logger(CommunityService.name);
  constructor(
    @InjectRepository(CommunityRole)
    private readonly communityRoleRepo: Repository<CommunityRole>,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const JWT_SECRET = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });
      if (!payload.userId) {
        throw new UnauthorizedException();
      }
      // extract communityId from body or queries
      const communityId = parseInt(request.body?.communityId);
      if (Number.isNaN(communityId)) {
        throw new BadRequestException("Provide a valid communityId!");
      }
      if (communityId) {
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
