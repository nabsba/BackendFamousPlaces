import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_KEYS,
  logErrorAsyncMessage,
  logMessage,
  STATUS_SERVER,
  SUCCESS_MESSAGES_KEYS,
  SUCCESS_STATUS,
} from '../../common';
import prismaClientDB from '../../lib/prismadb';
import {
  handleAddPlaceToPreference,
  handleGetPlace,
  handleGetPlaces,
  handleGetPreSelectionName,
} from '../models/functions';
import { CreatePlace, FavoritePlaceBody, PlaceBody, PlacesBody, PreSelectionBody } from '../type';

export const resolversPlace = {
  Query: {
    place: async (_parent: undefined, args: PlaceBody) => {
      try {
        const result = await handleGetPlace(args);
        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.GET_PLACE,
          data: result,
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('famousPlace/graphql/resolversPlace', `${ERROR_MESSAGES.GET_PLACE}:`)},
         ${error}`);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.GET_PLACES,
        };
      }
    },
    places: async (_parent: undefined, args: PlacesBody) => {
      try {
        const result = await handleGetPlaces(args);

        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.GET_PLACES,
          data: result,
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('famousPlace/graphql/resolversPlace', `${ERROR_MESSAGES.GET_PLACES}:`)},
         ${error}`);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.GET_PLACES,
        };
      }
    },
    preselectionName: async (_parent: undefined, args: PreSelectionBody) => {
      try {
        const result = await handleGetPreSelectionName(args);

        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.GET_PRESELECTION_NAMES,
          data: {
            selections: result,
          },
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('famousPlace/graphql/resolversPlace', `${ERROR_MESSAGES.GET_PRESELECTION_NAMES}:`)},
         ${error}`);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.GET_PRESELECTION_NAMES,
        };
      }
    },
  },
  Mutation: {
    createPlace: async (input: CreatePlace) => {
      console.error(input);
      return true;
    },
    deletePlace: async (_: undefined, { id }: { id: string }) => {
      return prismaClientDB.place.delete({ where: { id } });
    },
    toggleFavoritePlace: async (_: undefined, { placeId, userId }: FavoritePlaceBody) => {
      try {
        const result = await handleAddPlaceToPreference(placeId, userId);

        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.ADD_PLACE_TO_PREFERENCE,
          data: {
            placeId: result.placeId,
          },
        };
      } catch (error) {
        logMessage(error as string);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.ADD_PLACE_TO_PREFERENCE,
        };
      }
    },
  },
};
