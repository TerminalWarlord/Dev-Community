import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt";
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserSkill } from 'src/entities/user-skill.entity';
import { Experience } from 'src/entities/experience.entity';

describe("UserController", () => {
  let service: UserService;
  let mockUserModel;
  let mockUserSkillModel;
  let mockExperienceModel;

  beforeEach(async () => {
    mockUserModel = {
      updateOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findById: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockImplementation((data) => Promise.resolve(data)),
      update: jest.fn()
    }


    mockUserSkillModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
      find: jest.fn().mockResolvedValue([{
        id: 1,
        skill: { id: 2, skillTitle: 'TypeScript' }
      }]),
    }

    mockExperienceModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      find: jest.fn().mockImplementation((data) => Promise.resolve([data])),
    }
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getRepositoryToken(UserSkill),
          useValue: mockUserSkillModel,
        },
        {
          provide: getRepositoryToken(Experience),
          useValue: mockExperienceModel,
        },
      ],

    }).compile();
    service = module.get(UserService);
  })

  it('Can create and instance of user service', async () => {
    expect(service).toBeDefined();
  });


  it('can get user profile', async () => {
    const profile = await service.getUserProfile(1);
    expect(profile).toBeDefined();
  });


  it('throws error if user provides an invalid userId', async () => {
    mockUserModel.findOne = jest.fn().mockReturnValue(null);
    await expect(service.getUserProfile(1)).rejects.toThrow(NotFoundException)
  });


  it("can get user's skills", async () => {
    const userSkills = await service.getUserSkills(
      { userId: "1" },
      { page: "1", limit: "10" }
    );
    expect(userSkills).toBeDefined();
  })

  it("can get user's experiences", async () => {
    const userExperiences = await service.getUserExperiences(
      { userId: "1" },
      { page: "1", limit: "10" }
    );
    expect(userExperiences).toBeDefined();
  })


  it("allows user to change password", async () => {
    const oldPassword = "1234";
    const newPassword = "12345";
    mockUserModel.findOne = jest.fn().mockResolvedValue({ password: await bcrypt.hash(oldPassword, 10) });
    await service.changePassword({
      newPassword,
      oldPassword
    }, { userId: "1" });
  })

  it("throws error if user provides wrong password while changing password", async () => {
    const oldPassword = "12346";
    const newPassword = "12345";
    mockUserModel.findOne = jest.fn().mockResolvedValue({ password: await bcrypt.hash(oldPassword, 10) });
    await expect(service.changePassword({
      newPassword,
      oldPassword: "1234"
    }, { userId: "1" })).rejects.toThrow(ForbiddenException);
  })


  it("throws error if user provides wrong userId while changing password", async () => {
    const oldPassword = "12346";
    const newPassword = "12345";
    mockUserModel.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.changePassword({
      newPassword,
      oldPassword
    }, { userId: '1' })).rejects.toThrow(UnauthorizedException);
  })
})