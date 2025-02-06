import { ERROR_MESSAGES, logErrorAsyncMessage, logMessage } from '../../common';
import { handleRefreshToken } from '../../jwt';
import prismaClientDB from '../../lib/prismadb';
import { LoginArgs, registerUser } from '../types/types';
import {isUserInTheDB, createUserInTheDB } from '../services/authentifications';

const handleLogin = async (data: LoginArgs) => {
  try {
    const { userName, password } = data;
    await prismaClientDB.userAuthentification.findFirst({
      where: {
        userName,
        password,
      },
    });
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('auth/models/authentification', `${ERROR_MESSAGES.LOGIN}:`)},
  ${error}`);
  }
};



const handleRegisterUser = async (userInfo: registerUser) => {
  try {
    return await prismaClientDB.$transaction(async (tx) => {
      const account = await isUserInTheDB(tx, userInfo);
      if (account) {
        return await handleRefreshToken(userInfo.data);
      }
      return await createUserInTheDB(tx, userInfo);
    });
  } catch (error) {
    logMessage(`${logErrorAsyncMessage('auth/models/authentification', `${ERROR_MESSAGES.REGISTER_USER}:`)},
    ${error}`);
    throw new Error(ERROR_MESSAGES.REGISTER_USER);
  }
};




const handleRegisterUserWithCookie = async (data: registerUser) => {
  try {
    await prismaClientDB.userAuthentification.findFirst({
      where: {
        userName: data.data.userName,
      },
    });
  } catch (error) {
    logMessage(`${logErrorAsyncMessage(
      'auth/models/authentification/',
      `${ERROR_MESSAGES.REGISTER_USER_WITH_COOKIE}:`,
    )},
    ${error}`);
  }
};

export { handleLogin, handleRegisterUser, handleRegisterUserWithCookie };
