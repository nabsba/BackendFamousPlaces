import { logErrorAsyncMessage, logMessage } from '../../common';
import { returnToken } from '../../jwt';
import { Prisma } from '../../prisma/generated';
import { registerUser } from '../types/types';

const register = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `Error register:`)},
      ${error.message}`);
      throw new Error(`Error webAuthorization', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  unknown error`);
    }
  }
};

const login = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `login:`)},
      ${error.message}`);
      throw new Error(`Error webAuthorization', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  unknown error`);
    }
  }
};

const logout = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `logout:`)},
      ${error.message}`);
      throw new Error(`Error logout', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('autlogout/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  unknown error`);
    }
  }
};

const isAuthenticated = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `isAuthenticated:`)},
      ${error.message}`);
      throw new Error(`Error logout', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('autlogout/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  isAuthenticated unknown error`);
    }
  }
};

const resetPassword = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `resetPassword:`)},
      ${error.message}`);
      throw new Error(`Error logout', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('autlogout/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  resetPassword unknown error`);
    }
  }
};

const updatePassword = async (): Promise<void> => {
  try {
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('auth/services/authentifications', `resetPassword:`)},
      ${error.message}`);
      throw new Error(`Error logout', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('autlogout/services/authentifications', `Unknown error`)}`);
      throw new Error(`auth/services/authentifications',  updatePassword unknown error`);
    }
  }
};
const isUserInTheDB = async (tx:Prisma.TransactionClient, userInfo: registerUser) => {
  return await tx.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: userInfo.data.providerAccountId,
        providerAccountId: userInfo.data.providerAccountId,
        userId: userInfo.data.id,
      },
    },
  });
};

const createUserInTheDB = async (tx:Prisma.TransactionClient, userInfo:registerUser) => {
  const clientRole = await tx.role.findUnique({
    where: { roleName: 'client' },
  });
  if (!clientRole) {
    throw new Error('Default role "client" not found');
  }
  const token = returnToken(userInfo.data);
  await tx.user.create({
    data: {
      id: userInfo.data.id,
      email: userInfo.data.email,
      name: userInfo.data.userName, // Optional, set as per the data
      roleId: clientRole.id, // Make sure to reference a valid role ID
      accounts: {
        create: {
          type: userInfo.data.type,
          provider: userInfo.data.providerAccountId,
          providerAccountId: userInfo.data.providerAccountId,
          refresh_token: token, // Optional
        },
      },
    },
  });
  return token;
};

export { register, login, logout, isAuthenticated, resetPassword, updatePassword, createUserInTheDB, isUserInTheDB };
