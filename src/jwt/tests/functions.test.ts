import jwt, { JwtPayload } from 'jsonwebtoken';
import { returnToken, verifyToken } from '../services/function';

jest.mock('jsonwebtoken'); // Mock jwt functions

describe('verifyToken', () => {
  const mockJwtSecretKey = 'mock-secret-key';

  beforeEach(() => {
    process.env.JWT_SECRET_KEY = mockJwtSecretKey;
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should return decoded token if verification succeeds', () => {
    const mockToken = 'mockToken';
    const mockDecoded: JwtPayload = { id: '123', email: 'test@example.com' };

    // Correctly mock jwt.verify
    jest.spyOn(jwt, 'verify').mockImplementation(() => mockDecoded);

    const decoded = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockJwtSecretKey);
    expect(decoded).toEqual(mockDecoded);
  });

  it('should throw an error if verification fails', () => {
    const mockToken = 'mockToken';

    // Simulate a failure in jwt.verify
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => verifyToken(mockToken)).toThrow("Error verifyToken:', Invalid token");
  });
});

describe('returnToken', () => {
  const mockJwtSecretKey = 'mock-secret-key';
  const mockData = {
    id: '123',
    email: 'test@example.com',
    userName: 'testUser',
    provider: 'google',
    providerAccountId: 'google-123',
  };

  beforeEach(() => {
    process.env.JWT_SECRET_KEY = mockJwtSecretKey;
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return a valid token if JWT_SECRET_KEY is set', () => {
    const mockToken = 'mockToken';
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const token = returnToken(mockData);

    expect(jwt.sign).toHaveBeenCalledWith(
      { exp: expect.any(Number), payload: { ...mockData, time: expect.any(String) } },
      mockJwtSecretKey,
    );
    expect(token).toEqual(mockToken);
  });

  it('should throw an error if JWT_SECRET_KEY is missing', () => {
    delete process.env.JWT_SECRET_KEY;

    expect(() => returnToken(mockData)).toThrow('Missing JWT_SECRET_KEY');
  });
  it('should throw an error if jwt.sign fails', () => {
    const mockError = new Error('JWT signing failed');

    // Mock jwt.sign to throw the error
    (jwt.sign as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    expect(() => returnToken(mockData)).toThrow(`Error return token:', ${mockError.message}`);
  });
});
