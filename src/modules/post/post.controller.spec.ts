import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { MailService } from '../mail/mail.service';
import { Post } from 'src/schemas/post.schema';
import { PostVote } from 'src/schemas/post-votes.schema';
import { CommunityRole } from 'src/schemas/community-role.schema';
import { getQueueToken } from '@nestjs/bullmq';
import { GetPostQueriesDto } from './dto/get-post.dto';
import mongoose from 'mongoose';
import { GetPostsQueriesDto } from './dto/get-posts.dto';
import { CreatePostBodyDto } from './dto/create-post.dto';
import * as postHelper from 'src/modules/post/post.helper';
import { UpdatePostBodyDto } from './dto/update-post.dto';
import { DeletePostBodyDto } from './dto/delete-post.dto';
import { VotePostBodyDto } from './dto/vote-post.dto';
import { VoteType } from 'src/common/post.enum';

jest.mock('nanoid', () => ({
  nanoid: () => 'mocked-nanoid'
}));



describe("PostController", () => {
  let service: PostService;
  let mockUserModel;
  let mockPostModel;
  let mockPostVoteModel;
  let mockCommunityRoleModel;
  let mockQueueService;
  let mockMailService;




  beforeEach(async () => {


    mockUserModel = {
      insertOne: jest.fn().mockImplementation((data: object) => Promise.resolve(data)),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(null)),
    }
    mockPostModel = {
      insertOne: jest.fn().mockResolvedValue({}),
      findOneAndUpdate: jest.fn().mockResolvedValue({}),
      findOne: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({}),
      aggregate: jest.fn().mockResolvedValue([]),
      slice: jest.fn().mockReturnValue({}),
    }

    mockPostVoteModel = {
      findOneAndUpdate: jest.fn().mockResolvedValue(null),
      aggregate: jest.fn().mockResolvedValue([])
    }
    mockMailService = {
      sendEmail: jest.fn().mockResolvedValue(null)
    }

    const mockConfigService = {
      get: (key: string) => key
    };
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Post.name),
          useValue: mockPostModel,
        },
        {
          provide: getModelToken(PostVote.name),
          useValue: mockPostVoteModel,
        },

        {
          provide: getModelToken(CommunityRole.name),
          useValue: mockCommunityRoleModel,
        },
        {
          provide: MailService,
          useValue: mockMailService
        },
        {
          provide: getQueueToken('posts'),
          useValue: mockQueueService
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ],

    }).compile();
    service = module.get(PostService);
  })

  it('Can create and instance of post service', async () => {
    expect(service).toBeDefined();
  });

  it("can get a post", async () => {
    await service.getPost(new GetPostQueriesDto(), { postSlug: "profile-post" })
  })

  it("throws error when user provides an invalid post slug", async () => {
    mockPostModel.lean = jest.fn().mockResolvedValue(null);
    await expect(
      service.getPost(new GetPostQueriesDto(), { postSlug: "profile-post" })
    ).rejects.toThrow(NotFoundException);
  });


  it("can get all user posts", async () => {
    const getPostsQueriesDto = new GetPostsQueriesDto();
    getPostsQueriesDto.profileId = new mongoose.Types.ObjectId().toString();
    await service.getAllPosts(
      getPostsQueriesDto,
      { userId: new mongoose.Types.ObjectId().toString() }
    );
  });

  it("can get all community posts", async () => {
    const getPostsQueriesDto = new GetPostsQueriesDto();
    getPostsQueriesDto.communityId = new mongoose.Types.ObjectId().toString();
    await service.getAllPosts(
      getPostsQueriesDto,
      { userId: new mongoose.Types.ObjectId().toString() }
    );
  });


  it("can create a post", async () => {
    const createPostBodyDto = new CreatePostBodyDto();
    createPostBodyDto.title = "Profile post";
    createPostBodyDto.content = "This is a dummy post, will delete this in a bit";
    createPostBodyDto.publishAt = "2026-05-22T10:18:00.000Z";
    const slugSpy = jest.spyOn(postHelper, 'generatePostSlug')
      .mockResolvedValue('test-post-slug');

    const schedulePostSpy = jest.spyOn(postHelper, 'schedulePost')
      .mockResolvedValue();
    const userId = new mongoose.Types.ObjectId().toString();
    await service.createCommunityPost(createPostBodyDto, { userId });
    slugSpy.mockClear();
    schedulePostSpy.mockClear();
  });


  it("can update a post", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue({
      postedBy: userId,
      title: "hello world",
      content: "this is a dummy post",
      _id: new mongoose.Types.ObjectId()
    })
    const updatePostBodyDto = new UpdatePostBodyDto();
    updatePostBodyDto.title = "Profile post Updated";
    updatePostBodyDto.content = "This is a dummy post, will delete this in a bit";
    await service.updateCommunityPost(updatePostBodyDto, { postSlug: "profile-post" }, { userId });
  });


  it("throws error when user tries to update a post that doesn't exist", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue(null)
    const updatePostBodyDto = new UpdatePostBodyDto();
    updatePostBodyDto.title = "Profile post Updated";
    updatePostBodyDto.content = "This is a dummy post, will delete this in a bit";
    await expect(
      service.updateCommunityPost(updatePostBodyDto, { postSlug: "profile-post" }, { userId })
    ).rejects.toThrow(NotFoundException);
  });


  it("can delete a post", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue({
      postedBy: userId,
      title: "hello world",
      content: "this is a dummy post",
      _id: new mongoose.Types.ObjectId()
    })
    const deletePostBodyDto = new DeletePostBodyDto();
    await service.deleteCommunityPost(deletePostBodyDto, { postSlug: "profile-post" }, { userId });
  });

  it("throws error if user tries to delete a post that doesn't exist", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue(null)
    const deletePostBodyDto = new DeletePostBodyDto();
    await expect(
      service.deleteCommunityPost(deletePostBodyDto, { postSlug: "profile-post" }, { userId })
    ).rejects.toThrow(NotFoundException);
  });


  it("can upvote a post", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue({
      postedBy: userId,
      title: "hello world",
      content: "this is a dummy post",
      _id: new mongoose.Types.ObjectId()
    })
    const votePostBodyDto = new VotePostBodyDto();
    votePostBodyDto.voteType = VoteType.UPVOTE;
    await service.voteCommunityPost(
      votePostBodyDto,
      { postSlug: 'profile-post' },
      { userId }
    );
  });

  it("throws error if user tries to cast vote on a post that doesn't exist", async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    mockPostModel.findOne = jest.fn().mockResolvedValue(null)
    const votePostBodyDto = new VotePostBodyDto();
    votePostBodyDto.voteType = VoteType.UPVOTE;
    await expect(service.voteCommunityPost(
      votePostBodyDto,
      { postSlug: 'profile-post' },
      { userId }
    )).rejects.toThrow(NotFoundException);
  });
})