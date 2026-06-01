import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import bcrypt from "bcrypt";

describe("AuthController", () => {
  let service: AuthService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
    }
    const mockJwtService: Partial<JwtService> = {
      signAsync: jest.fn().mockImplementation((payload: object, secret: string, expiresIn: string) => "jwt-token")
    }

    const mockConfigService = {
      get: (key: string) => "100"
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],

    }).compile();
    service = module.get(AuthService);
  })

  it('Can create and instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user", async () => {
    const user = service.signUp({
      email: 'joybiswas@gmail.com',
      fname: "Joy",
      lname: "Biswas",
      password: "12345",
    });
    expect(user).toBeDefined();
  });

  it("Throws error if user signs up with an email that is in use", async () => {
    mockUserModel.findOne.mockResolvedValue({ email: 'joybiswas@gmail.com' });
    await expect(service.signUp({
      email: 'joybiswas@gmail.com',
      fname: "Joy",
      lname: "Biswas",
      password: "12345",
    })).rejects.toThrow(BadRequestException);
  })


  it("signs in a user", async () => {
    mockUserModel.findOne.mockResolvedValue({
      password: await bcrypt.hash("12345", 10)
    });
    const user = await service.logIn({
      email: 'joybiswas@gmail.com',
      password: "12345",
    })
    expect(user).toBeDefined();
  })


  it("Throws error if user logs in with an email that doesn't exist", async () => {
    mockUserModel.findOne.mockResolvedValue(null);
    await expect(service.logIn({
      email: 'joybiswas@gmail.com',
      password: "12345",
    })).rejects.toThrow(NotFoundException);
  })


  it("Throws error if user logs in with an invalid password", async () => {
    mockUserModel.findOne.mockResolvedValue({
      password: await bcrypt.hash("12345", 10)
    });
    await expect(service.logIn({
      email: 'joybiswas@gmail.com',
      password: "123",
    })).rejects.toThrow(BadRequestException);
  })
})