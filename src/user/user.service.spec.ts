import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import User from '../entities/User';
import HTTP_MESSAGES from '../messages/httpMessages';
import { faker } from '@faker-js/faker';

jest.mock('bcrypt');
jest.mock('uuid');

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create a new user', async () => {
      const user: User = {
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        email: faker.internet.email(),
        password: '',
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
      };

      //mocking results
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('mocked-hash');
      (uuidv4 as jest.Mock).mockReturnValue('mocked-uuid');
      (prismaService.user.create as jest.Mock).mockResolvedValue({
        ...user,
        id: 'mocked-uuid',
        role: 'USER',
        currentLevel: 'A1',
        password: 'mocked-hash',
      });

      const result = await userService.createUser(user);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
      });

      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 12);

      expect(uuidv4).toHaveBeenCalled();

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: 'mocked-uuid',
          name: user.name,
          role: 'USER',
          birthdate: new Date(user.birthdate).toISOString(),
          email: user.email,
          country: user.country,
          state: user.state,
          city: user.city,
          password: 'mocked-hash',
          currentLevel: 'A1',
        },
      });

      expect(result).toEqual({
        message: HTTP_MESSAGES.user.create.status_201,
        data: {
          id: 'mocked-uuid',
          name: user.name,
          role: 'USER',
          birthdate: user.birthdate,
          email: user.email,
          country: user.country,
          state: user.state,
          city: user.city,
          password: 'mocked-hash',
          currentLevel: 'A1',
        },
      });
    });

    it('should throw an error if the user already exists', async () => {
      const user: User = {
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        email: faker.internet.email(),
        password: faker.internet.password(),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
      };

      //mocking that the user already exists
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      await expect(userService.createUser(user)).rejects.toThrow();
    });
  });

  describe('fetchUsers()', () => {
    it('should fetch all users', async () => {
      const users: User[] = [
        {
          name: faker.person.fullName(),
          birthdate: new Date(faker.date.birthdate()),
          email: faker.internet.email(),
          password: faker.internet.password(),
          country: faker.location.country(),
          state: faker.location.state(),
          city: faker.location.city(),
        },
        {
          name: faker.person.fullName(),
          birthdate: new Date(faker.date.birthdate()),
          email: faker.internet.email(),
          password: faker.internet.password(),
          country: faker.location.country(),
          state: faker.location.state(),
          city: faker.location.city(),
        },
      ];

      //mocking database fetch
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await userService.fetchUsers();

      expect(result).toEqual({
        message: HTTP_MESSAGES.user.fetchAll.status_200,
        data: users,
      });
    });

    it('should throw an error if there are no users to show', async () => {
      let users: User[] = [];

      //mocking an empty table in the database
      (prismaService.user.findMany as jest.Mock).mockResolvedValue(users);

      await expect(userService.fetchUsers()).rejects.toThrow();
    });
  });

  describe('fetchUser()', () => {
    it('should fetch a user', async () => {
      const user = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        email: faker.internet.email(),
        password: faker.internet.password(),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
      };

      //mocking fetched user from the database
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await userService.fetchUser(user.id);

      expect(result).toEqual({
        message: HTTP_MESSAGES.user.fetchOne.status_200,
        data: user,
      });
    });

    it('should throw an error if the user is not found', async () => {
      const id: string = faker.string.uuid();

      //mocking an id that doesn't exist in the database
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.fetchUser(id)).rejects.toThrow();
    });
  });

  describe('updateUser()', () => {
    it('should update a user', async () => {
      //mocking data sent by the user
      const userData: Partial<User> = {
        id: faker.string.uuid(),
        country: faker.location.country(),
      };

      //mocking the return from the database after update
      const updatedUser: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        email: faker.internet.email(),
        password: faker.internet.password(),
        country: userData.country,
        state: faker.location.state(),
        city: faker.location.city(),
      };

      //mocking database call
      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await userService.updateUser(userData);

      expect(result).toEqual({
        message: HTTP_MESSAGES.user.update.status_200,
        data: updatedUser,
      });
    });

    it('should return an error if the user is not found', async () => {
      //mocking data sent by the user
      const userData: Partial<User> = {
        id: faker.string.uuid(),
        country: faker.location.country(),
      };

      // Mocking Prisma to throw a P2025 error (record not found)
      const error = new Error('User not found');
      (error as any).code = 'P2025'; // Assigning the Prisma error code to simulate "user not found"
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(userService.updateUser(userData)).rejects.toThrow(
        'The user was not found or the ID is invalid.',
      );
    });

    it("should return an error if there's a constraint violation", async () => {
      //mocking data sent by the user
      const userData: Partial<User> = {
        id: faker.string.uuid(),
        country: faker.location.country(),
      };

      // Mocking Prisma to throw a P2002 error (record not found)
      const error = new Error('Constraint violation');
      (error as any).code = 'P2002'; // Assigning the Prisma error code to simulate "user not found"
      (prismaService.user.update as jest.Mock).mockRejectedValue(error);

      await expect(userService.updateUser(userData)).rejects.toThrow();
    });
  });

  describe('deleteUser()', () => {
    it('should delete a user', async () => {
      const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        email: faker.internet.email(),
        password: faker.internet.password(),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (prismaService.user.delete as jest.Mock).mockResolvedValue(user);

      const result = await userService.deleteUser(user.id);

      expect(prismaService.user.findUnique).toHaveBeenCalled();
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(result).toEqual({
        message: HTTP_MESSAGES.user.delete.status_200,
      });
    });

    it('should throw an error if the user is not found', async () => {
      const id: string = faker.string.uuid();

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(userService.deleteUser(id)).rejects.toThrow(
        'The user was not found or the id is not valid',
      );
    });
  });
});
