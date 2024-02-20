import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { AccessTokenGuard } from './access-token.guard';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

describe('AccessTokenGuard', () => {
    let mockJwtService: Partial<JwtService>;
    let mockJwtConfiguration: ConfigType<typeof jwtConfig>;

    beforeEach(() => {
        mockJwtService = {
            verifyAsync: jest.fn().mockResolvedValue({ sub: 'user_id' }),
        };

        mockJwtConfiguration = {
            secret: 'mockSecret',
            audience: 'mockAudience',
            issuer: 'mockIssuer',
            accessTokenTtl: 3600,
            refreshTokenTtl: 86400,
        };
    });

    it('should be defined', () => {
        const guard = new AccessTokenGuard(mockJwtService as JwtService, mockJwtConfiguration);
        expect(guard).toBeDefined();
    });

    it('should throw "UnauthorizedException" for missing token', async () => {
        const mockRequest = { headers: {} };
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue(mockRequest),
        } as unknown as ExecutionContext;
        const guard = new AccessTokenGuard(mockJwtService as JwtService, mockJwtConfiguration);

        try {
            await guard.canActivate(mockContext);
        } catch (error) {
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    });

    it('should throw "UnauthorizedException" for invalid token', async () => {
        mockJwtService.verifyAsync = jest.fn().mockRejectedValue(new Error());

        const mockRequest = { headers: { authorization: 'Bearer invalid_token' } };
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue(mockRequest),
        } as unknown as ExecutionContext;
        const guard = new AccessTokenGuard(mockJwtService as JwtService, mockJwtConfiguration);

        try {
            await guard.canActivate(mockContext);
        } catch (error) {
            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('invalid_token', mockJwtConfiguration);
            expect(error).toBeInstanceOf(UnauthorizedException);
        }
    });

    it('should return true for a valid token and attach payload to request', async () => {
        mockJwtService.verifyAsync = jest.fn().mockResolvedValue({ sub: 'user_id' });

        const mockRequest = { headers: { authorization: 'Bearer token' } };
        const mockContext = {
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue(mockRequest),
        } as unknown as ExecutionContext;
        const guard = new AccessTokenGuard(mockJwtService as JwtService, mockJwtConfiguration);

        const result = await guard.canActivate(mockContext);

        expect(result).toBeTruthy();
        expect(mockRequest[REQUEST_USER_KEY]).toEqual({ sub: 'user_id' });
        expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('token', mockJwtConfiguration);
    });
});
