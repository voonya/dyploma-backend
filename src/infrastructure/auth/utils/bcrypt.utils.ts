import * as bcrypt from 'bcrypt';

const HASH_SALT = 13;

export const comparePasswords = (hashedPassword: string, password: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hash = (data: string) => {
  return bcrypt.hash(data, Number(HASH_SALT));
};
