import { WeatherBody } from './../../famousPlace/type';
import { ERROR_MESSAGES, ERROR_MESSAGES_KEYS, logErrorAsyncMessage, logMessage, STATUS_SERVER } from '../../common';
import { getFakeWeather } from '../services/functions';

const handleGetWeather = async (data: WeatherBody) => {
  try {
    const result = getFakeWeather(data);
    return result;
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('famousPlace/graphql/handleGetWeather', `${ERROR_MESSAGES.GET_WEATHER}:`)},
               ${error}`);
    return {
      status: STATUS_SERVER.SERVER_ERROR,
      isError: true,
      messageKey: ERROR_MESSAGES_KEYS.GET_WEATHER,
    };
  }
};

export { handleGetWeather };
