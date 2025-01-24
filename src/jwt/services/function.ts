import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { logErrorAsyncMessage, logMessage } from '../../common';
import { ReturnTokenArgs } from '../types/types';

const returnToken = (data: ReturnTokenArgs): string | null => {
  try {
    const { id, email, userName, provider, providerAccountId } = data;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('Missing JWT_SECRET_KEY');
    }

    const payload = {
      time: new Date().toISOString(),
      id,
      email,
      userName,
      provider,
      providerAccountId,
    };

    const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 864000, payload }, jwtSecretKey);
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('jwt/services/function', `returnToken`)},
      ${error.message}`);
      throw new Error(`Error return token:', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('jwt/services/function', `returnToken`)},
     unknown error occured`);
      throw new Error(`Error return token:',  returnToken`);
    }
  }
};
const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error('JWT secret key is not defined in environment variables.');
    }
    const verified = jwt.verify(token, jwtSecretKey) as jwt.JwtPayload;
    return verified;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('jwt/services/function', `verifyToken`)},
      ${error.message}`);
      throw new Error(`Error verifyToken:', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('jwt/services/function', `verifyToken`)},
      unknown error`);
      throw new Error(`Error verifyToken:',  unknown error`);
    }
  }
};

const mobileAuthorization = (req: Request) => {
  try {
    if (!req.headers.authorization) throw new Error('No authorization');

    if (req.headers.isauthorizationneeded === 'false') return true;
    const token = req.headers.authorization!.replace('Bearer ', '');
    verifyToken(token);
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('jwt/services/function/mobileAuthorization', `mobileAuthorization`)},
    ${error.message}`);
      throw new Error(`Error mobileAuthorization:', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('jwt/services/function', `mobileAuthorization`)},
      unknown error`);
      throw new Error(`Error mobileAuthorization:',  unknown error`);
    }
  }
};

const webAuthorization = () => {
  try {
    // not yet developed
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logMessage(`${logErrorAsyncMessage('jwt/services/function/webAuthorization', `Error webAuthorizationn:`)},
      ${error.message}`);
      throw new Error(`Error webAuthorization', ${error.message}`);
    } else {
      logMessage(`${logErrorAsyncMessage('jwt/services/function/webAuthorization', `Unknown error`)}`);
      throw new Error(`Error webAuthorization',  unknown error`);
    }
  }
};

export { returnToken, verifyToken, mobileAuthorization, webAuthorization };
