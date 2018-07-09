import { AuthService } from '@api/auth/auth.service';
import { UsersService } from '@api/auth/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('AuthService', () => {
  let service: AuthService;
  const config = {
    jwt: {
      tokenSecret: 'very-secret-token',
      expiryTime: 3600
    },
    users: {
      testUser: {
        username: 'testUser',
        role: 'tester',
        password: bcrypt.hash('very-secure-password', 10),
        unhashedPassword: 'very-secure-password'
      }
    }
  };
  const user = config.users.testUser;
  const userService = new UsersService(config as any);
  beforeAll(async () => {
    service = new AuthService(userService, config as any);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createToken', () => {
    it('should create a valid token', async () => {
      const token = await service.createToken(user.username, user.role);
      expect(typeof token).toBe('string');
      const verifyResult = (await jwt.verify(
        token,
        config.jwt.tokenSecret
      )) as any;
      expect(verifyResult).toMatchObject({
        username: user.username,
        role: user.role
      });
      expect(verifyResult.exp - verifyResult.iat).toBe(config.jwt.expiryTime);
    });
  });

  describe('login', () => {
    const { username, unhashedPassword: password } = user;
    it('should return a valid token on successful login', async () => {
      const token = await service.login(username, password);
      expect(typeof token).toBe('string');
      const verifyResult = (await jwt.verify(
        token,
        config.jwt.tokenSecret
      )) as any;
      expect(verifyResult).toMatchObject({
        username: user.username,
        role: user.role
      });
      expect(verifyResult.exp - verifyResult.iat).toBe(config.jwt.expiryTime);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      await expect(
        service.login(username, 'fake-password')
      ).rejects.toThrowError(UnauthorizedException);
    });

    it("should throw UnauthorizedException on username that doesn't exist", async () => {
      await expect(service.login('fake-user', password)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('validateUser', () => {
    const { username, role } = user;
    it('should return user with correct payload', async () => {
      expect(await service.validateUser({ username, role })).toEqual({
        username,
        role
      });
    });
    it('should return undefined with incorrect payload', async () => {
      expect(
        await service.validateUser({ username: 'fake-user', role: 'faker' })
      ).toBe(undefined);
    });
  });
});
