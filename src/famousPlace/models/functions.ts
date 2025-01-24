import { ERROR_MESSAGES, logErrorAsyncMessage, logMessage } from '../../common';
import prismaClientDB from '../../lib/prismadb';
import { PlaceBody, PlacesBody, PreSelectionBody } from '../type';
import { ROW_PER_PAGE } from '../services/constant';
import { listFilesInFolder } from '../../firebase';

const handleAddPlaceToPreference = async (placeId: string, userId: string) => {
  try {
    let existingPlace = await prismaClientDB.placeOnUser.findUnique({
      where: {
        userId_placeId: {
          userId: userId,
          placeId: placeId,
        },
      },
    });
    if (existingPlace) {
      existingPlace = await prismaClientDB.placeOnUser.delete({
        where: {
          userId_placeId: {
            userId: userId,
            placeId: placeId,
          },
        },
      });
    } else {
      existingPlace = await prismaClientDB.placeOnUser.create({
        data: {
          userId: userId,
          placeId: placeId,
        },
      });
    }
    return existingPlace;
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('src/famousPlace/services/function/handleAddPlaceToPreference', `${ERROR_MESSAGES.ADD_PLACE_TO_PREFERENCE}:`)},
        ${error}`);
    throw error;
  }
};
const returnTotalRow = (args: PlacesBody) => {
  switch (args.type) {
    case '0':
      return prismaClientDB.place.count();
    case '2':
      return 5;
    case '3':
      return prismaClientDB.placeOnUser.count({
        where: {
          userId: args.userId,
        },
      });
    default:
      return prismaClientDB.place.count({
        where: {
          placeDetail: {
            some: {
              languageId: args.language ? parseInt(args.language) + 1 : 1,
            },
          },
          users: {
            some: {
              userId: args.userId,
            },
          },
        },
      });
  }
};
const returnQueryFilterPlace = (args: PlacesBody, fromRow: number) => {
  switch (args.type) {
    // all poopular places
    case '0':
      return prismaClientDB.place.findMany({
        orderBy: {
          createdAt: 'asc', // Sort by createdAt field in descending order (most recent first)
        },
        skip: fromRow, // Skip the first 3 rows (to start from the 4th row)
        take: ROW_PER_PAGE,
        include: {
          address: {
            include: {
              city: {
                include: {
                  country: true,
                },
              },
            },
          },
          placeDetail: {
            where: {
              languageId: args.language ? parseInt(args.language) + 1 : 1, // Assuming 1 is the default language ID for English
            },
          },
          _count: {
            select: {
              users: true, // Count the number of related users
            },
          },
          users: {
            where: {
              userId: args.userId, // Check for the specific userId in PlaceOnUser
            },
            select: {
              userId: true, // Only fetch the `userId` to determine the relationship
            },
          },
        },
      });
    case '2':
      return prismaClientDB.place.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by createdAt field in descending order (most recent first)
        },
        // Skip the first 3 rows (to start from the 4th row)
        take: ROW_PER_PAGE,
        include: {
          address: {
            include: {
              city: {
                include: {
                  country: true,
                },
              },
            },
          },
          placeDetail: {
            where: {
              languageId: args.language ? parseInt(args.language) + 1 : 1, // Assuming 1 is the default language ID for English
            },
          },
          _count: {
            select: {
              users: true, // Count the number of related users
            },
          },
          users: {
            where: {
              userId: args.userId, // Check for the specific userId in PlaceOnUser
            },
            select: {
              userId: true, // Only fetch the `userId` to determine the relationship
            },
          },
        },
      });
    case '3':
      // last 5
      return prismaClientDB.place.findMany({
        where: {
          users: {
            some: {
              userId: args.userId, // Filter places where the userId exists in the PlaceOnUser relation
            },
          },
        },
        orderBy: {
          createdAt: 'asc', // Sort by createdAt field in descending order
        },
        skip: fromRow, // Skip the specified number of rows
        take: ROW_PER_PAGE, // Limit the number of rows returned
        include: {
          address: {
            include: {
              city: {
                include: {
                  country: true, // Include nested relations
                },
              },
            },
          },
          placeDetail: {
            where: {
              languageId: args.language ? parseInt(args.language) + 1 : 1, // Language filter
            },
          },
          _count: {
            select: {
              users: true, // Include the count of related users
            },
          },
          users: {
            where: {
              userId: args.userId, // Optional: Filter users specific to the given userId
            },
            select: {
              userId: true, // Fetch only the userId for users
            },
          },
        },
      });

    default:
      return prismaClientDB.place.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by createdAt field in descending order (most recent first)
        },
        take: ROW_PER_PAGE,
        include: {
          address: {
            include: {
              city: {
                include: {
                  country: true,
                },
              },
            },
          },
          placeDetail: {
            where: {
              languageId: args.language ? parseInt(args.language) + 1 : 1, // Assuming 1 is the default language ID for English
            },
          },
          _count: {
            select: {
              users: true, // Count the number of related users
            },
          },
          users: {
            where: {
              userId: args.userId, // Check for the specific userId in PlaceOnUser
            },
            select: {
              userId: true, // Only fetch the `userId` to determine the relationship
            },
          },
        },
      });
  }
};
const handleGetPlaces = async (args: PlacesBody) => {
  try {
    const totalRows = await returnTotalRow(args);
    const fromRow =
      parseInt(args.page) > 1 ? (parseInt(args.page) - 1) * ROW_PER_PAGE : parseInt(args.page) == 1 ? 5 : 0;
    const result = await returnQueryFilterPlace(args, fromRow);
    const finalResult = [];

    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const isPlaceOnUser = result[i]._count.users > 0;
        finalResult.push({
          ...result[i],
          placeDetail: result[i].placeDetail[0],
          images: await listFilesInFolder(`${result[i].address.city.name.toLocaleLowerCase()}/${result[i].image}`),
          isFavoritePlace: isPlaceOnUser,
        });
      }
    }
    const data = {
      places: finalResult,
      page: args.page,
      rowPerPage: ROW_PER_PAGE,
      totalRows: totalRows,
    };
    return data;
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('src/famousPlace/services/function/handleGetPlaces', `${ERROR_MESSAGES.GET_PLACES}:`)},
    ${error}`);
    throw error;
  }
};
const handleGetPlace = async (args: PlaceBody) => {
  try {
    const result = await prismaClientDB.place.findFirst({
      where: {
        placeDetail: {
          some: {
            id: args.placeId, // Filter to match PlaceDetail with id = 4
          },
        },
      },
      include: {
        address: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
          },
        },
        placeDetail: {
          where: {
            id: args.placeId, // Filter the specific PlaceDetail
          },
        }, // Include related PlaceDetail data
        _count: {
          select: {
            users: true, // Count the number of related users
          },
        },
      },
    });

    const isPlaceOnUser = result!._count.users > 0;
    const resultFinal = {
      ...result,
      isFavoritePlace: isPlaceOnUser,
      images: [],
      placeDetail: result?.placeDetail[0],
      // images:  await listFilesInFolder(`${result[i].address.city.name.toLocaleLowerCase()}/${result[i].image}`),
    };

    const data = {
      place: resultFinal,
      page: 1,
      rowPerPage: ROW_PER_PAGE,
      totalRows: 0,
    };

    return data;
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('src/famousPlace/services/function/handleGetPlace', `${ERROR_MESSAGES.GET_PLACE}:`)},
    ${error}`);
    throw error;
  }
};
const returnQueryPreselectionName = (args: PreSelectionBody) => {
  switch (args.type) {
    case '0':
      return prismaClientDB.placeDetail.findMany({
        where: {
          name: {
            startsWith: args.text, // Matches names starting with the query
            mode: 'insensitive', // Case-insensitive search
          },
          languageId: parseInt(args.language) + 1, // Filter by language
        },
        select: {
          name: true,
          id: true,
        },
        // include: {
        //   place: true, // Include related Place data
        // },
        take: 10, // Limit results to avoid overloading
      });
    case '2':
      return prismaClientDB.placeDetail.findMany({
        where: {
          languageId: parseInt(args.language) + 1, // Filter by languageId
          place: {
            users: {
              some: {
                userId: args.userId, // Ensure the Place is linked to the user
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    default:
      return prismaClientDB.placeDetail.findMany({
        where: {
          name: {
            startsWith: args.text, // Matches names starting with the query
            mode: 'insensitive', // Case-insensitive search
          },
          languageId: parseInt(args.language) + 1, // Filter by language
        },
        select: {
          name: true,
          id: true,
        },
        // include: {
        //   place: true, // Include related Place data
        // },
        take: 10, // Limit results to avoid overloading
      });
  }
};
const handleGetPreSelectionName = async (args: PreSelectionBody) => {
  try {
    const result = await returnQueryPreselectionName(args);

    return result;
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('src/famousPlace/services/function/handleGetPreSelectionName', `${ERROR_MESSAGES.GET_PLACE}:`)},
    ${error}`);
    throw error;
  }
};

export {
  handleAddPlaceToPreference,
  handleGetPlaces,
  handleGetPreSelectionName,
  handleGetPlace,
  returnTotalRow,
  returnQueryFilterPlace,
};
