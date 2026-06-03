import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CommunityService } from '../community.service';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityRole } from 'src/entities/community-role.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/common/community.enum';

@Injectable()
export class CommunityAdminAuthGuard implements CanActivate {
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
      // extract params
      const communityId = parseInt(request.params.communityId);
      if (!communityId || Number.isNaN(communityId)) {
        throw new UnauthorizedException("Provide a valid communityId");
      }
      // check if userId
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
      if (!communityRole || communityRole.role !== Role.ADMIN) {
        throw new UnauthorizedException("You are not an admin!");
      }
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
