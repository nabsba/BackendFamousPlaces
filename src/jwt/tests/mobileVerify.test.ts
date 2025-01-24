import { mobileAuthorization, returnToken } from '../services/function';
import { Request } from 'express';

jest.mock('../services/function', () => ({
  ...jest.requireActual('../services/function'), // Keep other exports like `mobileAuthorization`
  verifyToken: jest.fn().mockReturnValue(true), // Mock `verifyToken`
}));
describe('mobileAuthorization', () => {
  const mockJwtSecretKey = 'eyJ32332';
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  it('should call verifyToken successfully without throwing an error', () => {
    process.env.JWT_SECRET_KEY = mockJwtSecretKey;

    const mockData = {
      id: '123',
      email: 'test@example.com',
      userName: 'testUser',
      provider: 'google',
      providerAccountId: 'google-123',
    };
    const a = returnToken(mockData);
    const mockReq = {
      headers: {
        authorization: `Bearer ${a}`,
      },
    } as Request;

    // expect(() => verifyToken('22')).not.toThrow();
    // Call your function and check behavior
    expect(() => mobileAuthorization(mockReq)).not.toThrow();
  });
});
const mockJwtSecretKey = 'mock-secret-key';
describe('mobileAuthorization', () => {
  let mockRequest: Partial<Request>;

  beforeEach(() => {
    mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    jest.clearAllMocks();
  });

  it('should throw an error if the authorization header is missing', () => {
    process.env.JWT_SECRET_KEY = mockJwtSecretKey;
    mockRequest.headers = {};

    expect(() => {
      mobileAuthorization(mockRequest as Request);
    }).toThrow("Error mobileAuthorization:', No authorization");
  });

  it('should throw an error if the authorization header is malformed', () => {
    process.env.JWT_SECRET_KEY = mockJwtSecretKey;
    mockRequest.headers = { authorization: 'InvalidTokenFormat' };

    expect(() => {
      mobileAuthorization(mockRequest as Request);
    }).toThrow("Error mobileAuthorization:', Error verifyToken:', jwt malformed");
  });
});
