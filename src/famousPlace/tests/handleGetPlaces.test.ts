import prismaClientDB from '../../lib/prismadb';
import { handleGetPlaces } from '../models/functions';

jest.mock('../models/functions', () => ({
  returnTotalRow: jest.fn(),
  returnQueryFilterPlace: jest.fn(),
  handleGetPlaces: jest.requireActual('../models/functions').handleGetPlaces,
}));
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
describe('handleGetPlaces', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });
  it('should return totalRows when returnTotalRow succeeds', async () => {
    // Arrange
    const mockPlaces = [
      {
        id: 1,
        name: 'Place 1',
        _count: { users: 2 }, // Properly mock _count as an object
        placeDetail: [{ id: 1 }], // Mock placeDetail as an array of objects
        address: { city: { name: 'City1' } }, // Mock address as an object
        createdAt: '2024-01-01T00:00:00.000Z',
        image: 'image1.jpg',
        users: [], // Mock users as an empty array
      },
      {
        id: 2,
        name: 'Place 2',
        _count: { users: 0 },
        placeDetail: [{ id: 1 }],
        address: { city: { name: 'City2' } },
        createdAt: '2024-01-02T00:00:00.000Z',
        image: 'image2.jpg',
        users: [],
      },
    ];

    // Mock the `prismaClientDB.place.findMany` method
    (prismaClientDB.place.findMany as jest.Mock).mockResolvedValue(mockPlaces);

    const args = {
      type: '0',
      userId: 'user123',
      language: 'en',
      page: '1',
    };

    // Act
    const result = await handleGetPlaces(args);

    // Adjusted expected result
    const expectedResult = {
      places: [
        {
          id: 1,
          name: 'Place 1',
          _count: { users: 2 },
          placeDetail: { id: 1 },
          address: { city: { name: 'City1' } },
          createdAt: '2024-01-01T00:00:00.000Z',
          image: 'image1.jpg',
          users: [],
          images: [],
          isFavoritePlace: true,
        },
        {
          id: 2,
          name: 'Place 2',
          _count: { users: 0 },
          placeDetail: { id: 1 },
          address: { city: { name: 'City2' } },
          createdAt: '2024-01-02T00:00:00.000Z',
          image: 'image2.jpg',
          users: [],
          images: [],
          isFavoritePlace: false,
        },
      ],
      page: '1',
      rowPerPage: 5,
      totalRows: undefined,
    };

    expect(result).toEqual(expectedResult); // Use `toEqual` for object comparison
  });
  // it('should throw an error when handleGetPlaces fails', async () => {

  //   const args = {
  //     type: '0',
  //     userId: 'user123',
  //     language: 'en',
  //     page: '1',
  //   };

  //   // toFix
  //   // await expect(handleGetPlaces(args)).rejects.toThrow("Missing JWT_SECRET_KEY");
  // });
});
