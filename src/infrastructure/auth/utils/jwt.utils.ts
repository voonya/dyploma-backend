import * as jwt from 'jsonwebtoken';

export const parseToken = <T>(token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
};

export const createToken = (
  payload: object,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign({ ...payload }, secret, {
    expiresIn,
  });
};
