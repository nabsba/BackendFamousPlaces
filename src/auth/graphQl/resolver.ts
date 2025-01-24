import {
  ERROR_MESSAGES,
  ERROR_MESSAGES_KEYS,
  logErrorAsyncMessage,
  logMessage,
  STATUS_SERVER,
  SUCCESS_MESSAGES_KEYS,
  SUCCESS_STATUS,
} from '../../common';
import { handleLogin, handleRegisterUser, handleRegisterUserWithCookie } from '../models/authentification';
import { LoginArgs, registerUser } from '../types/types';

export const resolversAuth = {
  Query: {
    login: async (_: undefined, { userName, password }: LoginArgs) => {
      const data = { userName, password };
      await handleLogin(data);
      return {
        status: 200,
        isError: false,
        messageKey: 'Login successful',
      };
    },
  },
  Mutation: {
    registerUser: async (_: undefined, data: registerUser) => {
      try {
        const result = await handleRegisterUser(data);
        return {
          status: SUCCESS_STATUS.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.REGISTER_USER,
          data: {
            token: result,
          },
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('auth/graphql/resolver', `${ERROR_MESSAGES.REGISTER_USER}:`)},
        ${error}`);
        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: ERROR_MESSAGES_KEYS.REGISTER_USER,
        };
      }
    },
    registerUserWithCookie: async (_: undefined, data: registerUser) => {
      try {
        await handleRegisterUserWithCookie(data);
        return {
          status: STATUS_SERVER.OK,
          isError: false,
          messageKey: SUCCESS_MESSAGES_KEYS.REGISTER_USER_WITH_COOKIE,
        };
      } catch (error) {
        logMessage(`${logErrorAsyncMessage('auth/graphql/resolver', `${ERROR_MESSAGES.REGISTER_USER_WITH_COOKIE}:`)},
      ${error}`);

        return {
          status: STATUS_SERVER.SERVER_ERROR,
          isError: true,
          messageKey: SUCCESS_MESSAGES_KEYS.REGISTER_USER_WITH_COOKIE,
        };
      }
    },
  },
  //   updateAuthentification: async (_: undefined, { id, name, owner }: { id: number; name: string; owner: string }) => {
  //     console.log(`Updating dog with ID: ${id}, name: ${name}, owner: ${owner}`);
  //     return prismaClientDB.dog.update({
  //       where: { id },
  //       data: { name, owner },
  //     });
  //   },
  //   deleteUser: async (_: undefined, { id }: { id: number }) => {
  //     console.log(`Deleting dog with ID: ${id}`);
  //     return prismaClientDB.dog.delete({ where: { id } });
  //   },
  // },
};
