import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_KEYS,
  logErrorAsyncMessage,
  logMessage,
  STATUS_SERVER,
  SUCCESS_MESSAGES_KEYS,
  SUCCESS_STATUS,
} from '../../common';
import { WeatherBody } from '../../famousPlace/type';
import { handleGetWeather } from '../models/handle';

export const resolverWeather = {
  Query: {
    weather: async (_parent: undefined, args: WeatherBody) => {
      try {
        const result = await handleGetWeather(args);
        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.GET_WEATHER,
          data: result,
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('famousPlace/graphql/resolverWeather', `${ERROR_MESSAGES.GET_PLACE}:`)},
               ${error}`);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.GET_WEATHER,
        };
      }
    },
  },
};
