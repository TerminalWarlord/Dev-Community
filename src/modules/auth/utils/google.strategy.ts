import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile, Strategy } from "passport-google-oauth20";
import { UserProvider } from "src/common/user.enum";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth.service";

async function generateTokens(jwtService: JwtService, configService: ConfigService, userId: number) {
  return {
    accessToken: await jwtService.signAsync({ userId }, {
      secret: configService.get<string>("JWT_SECRET"),
      expiresIn: Number(configService.get<string>('ACCESS_TOKEN_EXPIRY')),
    }),
    refreshToken: await jwtService.signAsync({ userId }, {
      secret: configService.get<string>("JWT_SECRET"),
      expiresIn: Number(configService.get<string>('REFRESH_TOKEN_EXPIRY')),
    })
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private logger = new Logger(AuthService.name);
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get('GOOGLE_CALLBACK_URL')!,
      scope: ["profile", "email"],
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails![0].value;
    const fname = profile.name?.givenName;
    const lname = profile.name?.familyName;
    const avatar = profile.photos ? profile.photos[0].value : undefined;
    try {
      const user = await this.userRepo.findOne({
        where: {
          email
        }
      });
      if (user && user.provider === UserProvider.GOOGLE) {
        return {
          userId: user.id,
          ...await generateTokens(this.jwtService, this.configService, user.id)
        }
      }
      if (user && user.provider !== UserProvider.GOOGLE) {
        throw new BadRequestException("You already signed up using credentials with that email");
      }
      const newUserDocument = this.userRepo.create({
        avatar,
        fname,
        lname,
        email,
        provider: UserProvider.GOOGLE
      });
      const newUser = await this.userRepo.save(newUserDocument);

      return {
        userId: newUser.id,
        ...await generateTokens(this.jwtService, this.configService, newUser.id)
      }

    } catch (err) {
      this.logger.error(err)
      if (err instanceof BadRequestException) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException("Failed to login with google");
    }
  }
}