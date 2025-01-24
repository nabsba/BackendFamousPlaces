import prismaClientDB from '../../lib/prismadb'; // Import your Prisma client instance
import { handleAddPlaceToPreference, returnTotalRow } from '../models/functions';

jest.mock('../../lib/prismadb', () => ({
  placeOnUser: {
    findUnique: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  place: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('handleAddPlaceToPreference', () => {
  const mockUserId = 'user123';
  const mockPlaceId = 'place123';

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should delete the place when it already exists for the user', async () => {
    // Mock `findUnique` to simulate an existing place
    (prismaClientDB.placeOnUser.findUnique as jest.Mock).mockResolvedValueOnce({
      userId: mockUserId,
      placeId: mockPlaceId,
    });

    // Mock `delete` to return the deleted place
    (prismaClientDB.placeOnUser.delete as jest.Mock).mockResolvedValueOnce({
      userId: mockUserId,
      placeId: mockPlaceId,
    });

    const result = await handleAddPlaceToPreference(mockPlaceId, mockUserId);

    // Verify that `findUnique` and `delete` are called correctly
    expect(prismaClientDB.placeOnUser.findUnique).toHaveBeenCalledWith({
      where: {
        userId_placeId: {
          userId: mockUserId,
          placeId: mockPlaceId,
        },
      },
    });
    expect(prismaClientDB.placeOnUser.delete).toHaveBeenCalledWith({
      where: {
        userId_placeId: {
          userId: mockUserId,
          placeId: mockPlaceId,
        },
      },
    });

    // Verify the function returns the deleted place
    expect(result).toEqual({ userId: mockUserId, placeId: mockPlaceId });
  });

  it('should create the place when it does not exist for the user', async () => {
    // Mock `findUnique` to simulate a non-existing place
    (prismaClientDB.placeOnUser.findUnique as jest.Mock).mockResolvedValueOnce(null);

    // Mock `create` to return the newly created place
    (prismaClientDB.placeOnUser.create as jest.Mock).mockResolvedValueOnce({
      userId: mockUserId,
      placeId: mockPlaceId,
    });

    const result = await handleAddPlaceToPreference(mockPlaceId, mockUserId);

    // Verify that `findUnique` and `create` are called correctly
    expect(prismaClientDB.placeOnUser.findUnique).toHaveBeenCalledWith({
      where: {
        userId_placeId: {
          userId: mockUserId,
          placeId: mockPlaceId,
        },
      },
    });
    expect(prismaClientDB.placeOnUser.create).toHaveBeenCalledWith({
      data: {
        userId: mockUserId,
        placeId: mockPlaceId,
      },
    });

    // Verify the function returns the created place
    expect(result).toEqual({ userId: mockUserId, placeId: mockPlaceId });
  });

  it('should log and rethrow an error when an exception occurs', async () => {
    const mockError = new Error('Database error');
    (prismaClientDB.placeOnUser.findUnique as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(handleAddPlaceToPreference(mockPlaceId, mockUserId)).rejects.toThrow(mockError);

    // Verify that the error is logged (if `logMessage` is mockable, you can add checks for it)
  });
});

describe('returnTotalRow', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return the total count of places when type is '0'", async () => {
    // Mock the `place.count` method
    (prismaClientDB.place.count as jest.Mock).mockResolvedValueOnce(10);

    const result = await returnTotalRow({ type: '0', userId: '', language: '', page: '1' });

    expect(prismaClientDB.place.count).toHaveBeenCalledTimes(1);
    expect(result).toBe(10);
  });

  it("should return 5 when type is '2'", async () => {
    const result = await returnTotalRow({ type: '2', userId: '', language: '', page: '1' });

    expect(result).toBe(5);
    expect(prismaClientDB.place.count).not.toHaveBeenCalled();
  });

  it("should return the count of places for a specific user when type is '3'", async () => {
    // Mock the `placeOnUser.count` method
    (prismaClientDB.placeOnUser.count as jest.Mock).mockResolvedValueOnce(7);

    const result = await returnTotalRow({ type: '3', userId: 'user123', language: '', page: '1' });
    expect(prismaClientDB.placeOnUser.count).toHaveBeenCalledWith({
      where: {
        userId: 'user123',
      },
    });
    expect(result).toBe(7);
  });

  it('should return the count of places matching the default case criteria', async () => {
    // Mock the `place.count` method
    (prismaClientDB.place.count as jest.Mock).mockResolvedValueOnce(15);

    const result = await returnTotalRow({
      type: 'default',
      userId: 'user123',
      language: '1',
      page: '1',
    });

    expect(prismaClientDB.place.count).toHaveBeenCalledWith({
      where: {
        placeDetail: {
          some: {
            languageId: 2, // language + 1
          },
        },
        users: {
          some: {
            userId: 'user123',
          },
        },
      },
    });
    expect(result).toBe(15);
  });
});
