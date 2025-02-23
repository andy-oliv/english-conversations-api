import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './DTOs/createUserDTO';
import HTTP_MESSAGES from '../messages/httpMessages';
import User from '../entities/User';
import UpdateUserDTO from './DTOs/updateUserDTO';
import { faker } from '@faker-js/faker';
import generateMockUser from '../utils/mockUser';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let prismaService: PrismaService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser()', () => {
    it('should return a new user', async () => {
      const mockUser: CreateUserDTO = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        birthdate: new Date(faker.date.birthdate()),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        password: '',
      };

      const response = {
        message: HTTP_MESSAGES.user.create.status_201,
        data: mockUser,
      };

      //Assuming createUser returns the created user
      jest.spyOn(userService, 'createUser').mockResolvedValue(response);

      const result = await userController.createUser(mockUser);

      expect(result).toEqual(response);
      expect(logger.log).toHaveBeenCalledWith('Creating new user');
    });
  });

  describe('fetchUsers()', () => {
    it('should return the fetched users', async () => {
      const users: User[] = [generateMockUser(), generateMockUser()];

      const response = {
        message: HTTP_MESSAGES.user.fetchAll.status_200,
        data: users,
      };

      //Assuming fetchUsers returns a list of users
      jest.spyOn(userService, 'fetchUsers').mockResolvedValue(response);

      const result = await userController.fetchUsers();

      expect(result).toEqual(response);
      expect(logger.log).toHaveBeenCalledWith(
        'Fetching users from the database',
      );
    });
  });

  describe('fetchUser()', () => {
    it('should return the fetched user', async () => {
      const id: string = 'mocked-uuid';

      const user: User = generateMockUser();

      const response = {
        message: HTTP_MESSAGES.user.fetchOne.status_200,
        data: user,
      };

      //Assuming fetchUser returns a user
      jest.spyOn(userService, 'fetchUser').mockResolvedValue(response);

      const result = await userController.fetchUser(id);

      expect(result).toEqual(response);
      expect(logger.log).toHaveBeenCalledWith(
        'Fetching user from the database',
      );
    });
  });

  describe('updateUser()', () => {
    it('should return the updated user', async () => {
      const id: string = 'mocked-uuid';
      const requestBody: UpdateUserDTO = {
        name: faker.person.fullName(),
        birthdate: new Date(faker.date.birthdate()),
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
      };

      const user: User = generateMockUser();

      const response = {
        message: HTTP_MESSAGES.user.update.status_200,
        data: user,
      };

      //Assuming updateUser returns an updatedUser
      jest.spyOn(userService, 'updateUser').mockResolvedValue(response);

      const result = await userController.updateUser(id, { ...requestBody });

      expect(result).toEqual(response);
      expect(logger.log).toHaveBeenCalledWith('A user is being updated');
    });
  });

  describe('deleteUser()', () => {
    it('should return the updated user', async () => {
      const id = 'mocked-uuid';

      const response = {
        message: HTTP_MESSAGES.user.delete.status_200,
      };

      //Assuming updateUser returns an updatedUser
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(response);

      const result = await userController.deleteUser(id);

      expect(result).toEqual(response);
      expect(logger.log).toHaveBeenCalledWith('A user is being deleted');
    });
  });
});
