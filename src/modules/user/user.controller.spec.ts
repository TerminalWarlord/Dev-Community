import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { Experience } from 'src/schemas/experience.schema';
import { UserSkill } from 'src/schemas/user-skill.schema';
import mongoose from 'mongoose';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from "bcrypt";

describe("UserController", () => {
  let service: UserService;
  let mockUserModel;
  let mockUserSkillModel;
  let mockExperienceModel;

  beforeEach(async () => {
    mockUserModel = {
      updateOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findById: jest.fn().mockReturnThis(),
      select: jest.fn().mockResolvedValue({ userId: new mongoose.Types.ObjectId().toString() })
    }


    mockUserSkillModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          _id: new mongoose.Types.ObjectId().toString(),
          skillId: { _id: 'skillId123', skillTitle: 'TypeScript' }
        }
      ])
    }

    mockExperienceModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      find: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([
        {
          _id: new mongoose.Types.ObjectId().toString(),
        }
      ])
    }
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(UserSkill.name),
          useValue: mockUserSkillModel,
        },
        {
          provide: getModelToken(Experience.name),
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
    const userId = new mongoose.Types.ObjectId().toString();
    const profile = await service.getUserProfile(userId);
    expect(profile).toBeDefined();
  });


  it('throws error if user provides an invalid userId', async () => {
    mockUserModel.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    const userId = new mongoose.Types.ObjectId().toString();
    await expect(service.getUserProfile(userId)).rejects.toThrow(NotFoundException)
  });


  it("can get user's skills", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const userSkills = await service.getUserSkills(
      { userId },
      { page: 1, limit: 10 }
    );
    expect(userSkills).toBeDefined();
  })

  it("can get user's experiences", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const userExperiences = await service.getUserExperiences(
      { userId },
      { page: 1, limit: 10 }
    );
    expect(userExperiences).toBeDefined();
  })


  it("allows user to change password", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const oldPassword = "1234";
    const newPassword = "12345";
    mockUserModel.findById = jest.fn().mockResolvedValue({ password: await bcrypt.hash(oldPassword, 10) });
    await service.changePassword({
      newPassword,
      oldPassword
    }, userId);
  })

  it("throws error if user provides wrong password while changing password", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const oldPassword = "12346";
    const newPassword = "12345";
    mockUserModel.findById = jest.fn().mockResolvedValue({ password: await bcrypt.hash(oldPassword, 10) });
    await expect(service.changePassword({
      newPassword,
      oldPassword: "1234"
    }, userId)).rejects.toThrow(ForbiddenException);
  })


  it("throws error if user provides wrong userId while changing password", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const oldPassword = "12346";
    const newPassword = "12345";
    mockUserModel.findById = jest.fn().mockResolvedValue(null);
    await expect(service.changePassword({
      newPassword,
      oldPassword
    }, userId)).rejects.toThrow(UnauthorizedException);
  })

})